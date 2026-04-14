#!/usr/bin/env ruby
# Fase 0 del plan de newsletter: auditar CSVs antiguos de Google Forms,
# deduplicar y exportar una lista limpia lista para importar a la Google Sheet.
#
# Uso:
#   ruby scripts/newsletter/audit-csvs.rb <directorio-con-csvs> [output.csv]
#
# Por defecto escribe subscribers-clean.csv en el directorio actual.
# No modifica los CSVs originales.

require 'csv'
require 'set'

EMAIL_RE = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

def find_email_column(headers)
  headers.each_with_index do |h, i|
    next if h.nil?
    return i if h.to_s.downcase.strip =~ /(e-?mail|correo|direcci[oó]n)/
  end
  nil
end

def scan_file(path)
  rows = []
  raw_content = File.read(path, encoding: 'utf-8').sub(/\A\xEF\xBB\xBF/, '')
  CSV.parse(raw_content, headers: true, liberal_parsing: true) do |row|
    col = find_email_column(row.headers) || 0
    raw = row.fields[col]
    next if raw.nil? || raw.strip.empty?
    rows << raw.strip
  end
  rows
rescue => e
  warn "  ! error leyendo #{path}: #{e.message}"
  []
end

dir = ARGV[0] or abort("uso: ruby audit-csvs.rb <dir> [output.csv]")
out = ARGV[1] || 'subscribers-clean.csv'
abort("no existe: #{dir}") unless Dir.exist?(dir)

out_abs = File.expand_path(out)
files = Dir.glob(File.join(dir, '*.csv')).reject { |f| File.expand_path(f) == out_abs }.sort
abort("sin .csv en #{dir}") if files.empty?

total_rows = 0
invalid = 0
per_file = {}
seen = Set.new
clean = []

files.each do |f|
  name = File.basename(f)
  rows = scan_file(f)
  per_file[name] = { total: rows.size, kept: 0, invalid: 0, duplicate: 0 }
  rows.each do |raw|
    total_rows += 1
    norm = raw.downcase.strip
    unless norm =~ EMAIL_RE
      invalid += 1
      per_file[name][:invalid] += 1
      next
    end
    if seen.include?(norm)
      per_file[name][:duplicate] += 1
      next
    end
    seen << norm
    clean << { email: norm, fuente: name }
    per_file[name][:kept] += 1
  end
end

CSV.open(out, 'w') do |csv|
  csv << %w[email suscrito_en fuente status unsubscribe_token last_sent]
  today = Time.now.strftime('%Y-%m-%d')
  clean.each do |row|
    csv << [row[:email], today, row[:fuente], 'active', '', '']
  end
end

puts "=== Auditoría CSVs newsletter ==="
puts "Ficheros procesados: #{files.size}"
puts "Filas totales leídas: #{total_rows}"
puts "Emails únicos válidos: #{clean.size}"
puts "Duplicados descartados: #{total_rows - clean.size - invalid}"
puts "Inválidos descartados: #{invalid}"
puts
puts "Por fichero:"
per_file.each do |name, s|
  puts "  #{name}: total=#{s[:total]} kept=#{s[:kept]} dup=#{s[:duplicate]} invalid=#{s[:invalid]}"
end
puts
puts "→ Escrito: #{out} (#{clean.size} filas)"
puts
days_1500 = (clean.size / 1500.0).ceil
days_2000 = (clean.size / 2000.0).ceil
puts "Estimación días de envío:"
puts "  a 1500/día (margen): #{days_1500}"
puts "  a 2000/día (cuota Workspace): #{days_2000}"
