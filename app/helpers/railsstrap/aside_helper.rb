module Railsstrap
  module AsideHelper

    def default_options
      return {:id => 'aside', :size => '', :show_close => true, :dismiss => true}
    end

    #asides have a header, a body, a footer for options.
    #The js side of things grabs this tag and moves it up to the body
    #then outputs the html using jQuery's html function
    def aside_dialog(options = {}, &block)
      opts = default_options.merge(options)
      content_tag :div, :role => 'dialog', :id => options[:id], :class => 'railsstrap-aside aside fade', :data => {:animation => options[:animation]} do
        content_tag :div, :class => "aside-dialog #{opts['size']}" do
          content_tag :div, :class => 'aside-content' do
            aside_header(options[:header], &block) +
                aside_body(options[:body], &block) +
                aside_footer(options[:footer], &block)
          end
        end
      end
    end

    def aside_header(options, &block)
      content_tag :div, :class => 'aside-header' do
        if options[:show_close]
          close_button(options[:dismiss]) +
              content_tag(:h4, options[:title], :class => 'aside-title', &block)
        else
          content_tag(:h4, options[:title], :class => 'aside-title', &block)
        end
      end
    end

    def aside_body(options, &block)
      content_tag :div, options[:content], :class => 'aside-body', :style => options[:style], &block
    end

    def aside_footer(options, &block)
      content_tag :div, options[:content], :class => 'aside-footer', &block
    end

    def close_button(dismiss)
      #It doesn't seem to like content_tag, so we do this instead.
      raw("<button class=\"close\" data-dismiss=\"#{dismiss}\" aria-hidden=\"true\">&times;</button>")
    end

    def aside_toggle(content_or_options = nil, options, &block)
      if block_given?
        options = content_or_options if content_or_options.is_a?(Hash)
        default_options = {:class => 'btn btn-default', 'data-toggle' => 'aside', :href => options[:dialog]}.merge(options)

        content_tag :a, nil, default_options, true, &block
      else
        default_options = {:class => 'btn btn-default', 'data-toggle' => 'aside', :href => options[:dialog]}.merge(options)
        content_tag :a, content_or_options, default_options, true
      end
    end

    def aside_cancel_button(content, options)
      default_opts = {:class => 'btn railsstrap-aside-cancel-button'}

      content_tag_string 'a', content, default_opts.merge(options)
    end

  end
end