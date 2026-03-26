# Tweet Liquid Tag
#
# Generates a link to the tweet since the Twitter oEmbed API is discontinued.
# Example:
#   {% tweet 464180168303456256 %}
#

module Jekyll
  class TweetTag < Liquid::Tag

    def render(context)
      tweet_id = @markup.strip
      %(<blockquote><p><a href="https://twitter.com/i/status/#{tweet_id}" target="_blank" rel="noopener">Ver tweet original</a></p></blockquote>)
    end

  end
end

Liquid::Template.register_tag('tweet', Jekyll::TweetTag)
