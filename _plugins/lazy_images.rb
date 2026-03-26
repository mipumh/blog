module Jekyll
  module LazyLoadFilter
    def lazy_load(input)
      input.gsub(/<img\s/) { |match| '<img loading="lazy" decoding="async" ' }
    end
  end
end

Liquid::Template.register_filter(Jekyll::LazyLoadFilter)
