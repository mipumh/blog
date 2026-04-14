#!/usr/bin/env ruby
# Genera el borrador HTML del newsletter a partir de:
#   - el fichero _newsletters/YYYY-MM-DD.md más reciente (intro, cierre, subject, news)
#   - el post más reciente de _posts/ (titular + entradilla + link al artículo)
#
# Compila template.mjml.erb → MJML → HTML vía `npx mjml`.
# Salida: _drafts/newsletters/YYYY-MM-DD.html
#
# El disparo viene del workflow manual .github/workflows/weekly-newsletter.yml
# o del usuario ejecutando este script en local.

require 'yaml'
require 'erb'
require 'date'
require 'fileutils'
require 'kramdown'

ROOT = File.expand_path('../../..', __FILE__)
POSTS_DIR = File.join(ROOT, '_posts')
ISSUES_DIR = File.join(ROOT, '_newsletters')
AUTHORS_FILE = File.join(ROOT, '_data', 'authors.yml')
CONFIG_FILE = File.join(ROOT, '_config.yml')
TEMPLATE_FILE = File.join(ROOT, 'scripts', 'newsletter', 'template.mjml.erb')
OUTPUT_DIR = File.join(ROOT, '_drafts', 'newsletters')

def load_config
  yaml = YAML.load_file(CONFIG_FILE)
  {
    'url' => yaml['url'] || 'https://mip.umh.es',
    'baseurl' => yaml['baseurl'] || '/blog'
  }
end

def parse_front_matter(raw, path)
  unless raw =~ /\A---\s*\n(.*?)\n---\s*\n(.*)/m
    raise "frontmatter inválido en #{path}"
  end
  yaml_str = Regexp.last_match(1)
  front =
    begin
      YAML.safe_load(yaml_str, permitted_classes: [Date, Time])
    rescue ArgumentError
      YAML.safe_load(yaml_str, [Date, Time])
    end
  body = Regexp.last_match(2)
  [front, body]
end

def load_latest_issue
  files = Dir.glob(File.join(ISSUES_DIR, '[0-9]*.md')).sort
  raise "sin ficheros en #{ISSUES_DIR}. Crea uno con formato YYYY-MM-DD.md" if files.empty?
  path = files.last
  raw = File.read(path, encoding: 'utf-8')
  front, body = parse_front_matter(raw, path)

  intro_md, cierre_md = body.split(/^===\s*$/, 2)
  intro_md = (intro_md || '').strip
  cierre_md = (cierre_md || '').strip

  {
    'path' => path,
    'date' => front['date'] || File.basename(path, '.md'),
    'subject' => front['subject'] || 'MIP Newsletter',
    'news' => front['news'] || [],
    'intro_html' => markdown_to_html(intro_md),
    'cierre_html' => markdown_to_html(cierre_md)
  }
end

def markdown_to_html(text)
  return '' if text.nil? || text.empty?
  Kramdown::Document.new(text).to_html
end

def load_latest_post
  files = Dir.glob(File.join(POSTS_DIR, '*.md')).sort
  raise "sin posts en #{POSTS_DIR}" if files.empty?
  path = files.last
  raw = File.read(path, encoding: 'utf-8')
  front, body = parse_front_matter(raw, path)
  basename = File.basename(path, '.md')
  date = basename[0, 10]
  slug = basename[11..-1]
  {
    'title' => front['title'],
    'url' => front['permalink'] || "/#{date.tr('-', '/')}/#{slug}/",
    'excerpt' => extract_excerpt(body)
  }
end

def extract_excerpt(body)
  clean = body.gsub(/!\[.*?\]\(.*?\)/, '').strip
  first = clean.split("\n\n").find { |p| p.length > 40 }
  return '' unless first
  first.gsub(/\*\*|\*|\[|\]\(.*?\)/, '').strip.slice(0, 240)
end

def absolute_url(config, path)
  return path if path.to_s.start_with?('http')
  "#{config['url']}#{config['baseurl']}#{path}"
end

def render_template(post, issue, config)
  post_url = absolute_url(config, post['url'])
  site_url = "#{config['url']}#{config['baseurl']}/"
  unsubscribe_url = '{{unsubscribe_base}}?action=unsubscribe&token={{token}}'
  src = File.read(TEMPLATE_FILE)
  erb =
    if RUBY_VERSION >= '2.6'
      ERB.new(src, trim_mode: '-')
    else
      ERB.new(src, nil, '-')
    end
  erb.result(binding)
end

def compile_mjml(mjml_source, out_html)
  tmp = out_html.sub(/\.html$/, '.mjml')
  File.write(tmp, mjml_source)
  ok = system('npx', '--yes', 'mjml', tmp, '-o', out_html)
  raise 'mjml compilation failed' unless ok
  tmp
end

config = load_config
issue = load_latest_issue
post = load_latest_post

FileUtils.mkdir_p(OUTPUT_DIR)
out_html = File.join(OUTPUT_DIR, "#{issue['date']}.html")

mjml_source = render_template(post, issue, config)
tmp_mjml = compile_mjml(mjml_source, out_html)

puts "Boletín generado:"
puts "  fichero fuente: #{issue['path']}"
puts "  asunto:         #{issue['subject']}"
puts "  artículo:       #{post['title']}"
puts "  noticias:       #{issue['news'].size}"
puts "  salida HTML:    #{out_html}"
puts "  salida MJML:    #{tmp_mjml}"
