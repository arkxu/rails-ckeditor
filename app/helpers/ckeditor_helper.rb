module CkeditorHelper
  def new_attachment_path_with_session_information(kind)
    session_key = ActionController::Base.session_options[:key]
    
    options = {}
    controller = case kind
    when :image then Ckeditor::PLUGIN_FILE_MANAGER_IMAGE_UPLOAD_URI
    when :file  then Ckeditor::PLUGIN_FILE_MANAGER_UPLOAD_URI
    else '/ckeditor/create'
    end
    
    if controller.include?('?')
      arr = controller.split('?')
      options = Rack::Utils.parse_query(arr.last)
      controller = arr.first
    end
    
    options[:controller] = controller
    options[:protocol] = "http://"
    options[session_key] = cookies[session_key]
    #options[request_forgery_protection_token] = form_authenticity_token unless request_forgery_protection_token.nil?
    options[:folder_id] = params[:folder_id]
    options[:site_id] = @site.id
    url_for(options)
  end

  def delete_attachment_path
    assemble_path '/ckeditor/delete_asset'
  end

  def update_attachment_path
    assemble_path '/ckeditor/update'
  end

  def move_attachment_path
    assemble_path '/ckeditor/move_asset'
  end

  def delete_folder_path
    assemble_path '/ckeditor/delete_folder'
  end

  def rename_folder_path
    assemble_path '/ckeditor/rename_folder'
  end

  def file_image_tag(filename, path)
    extname = File.extname(filename)
    
    image = case extname.to_s
    when '.swf' then '/javascripts/ckeditor/images/swf.gif'
    when '.pdf' then '/javascripts/ckeditor/images/pdf.gif'
    when '.doc', '.txt' then '/javascripts/ckeditor/images/doc.gif'
    when '.mp3' then '/javascripts/ckeditor/images/mp3.gif'
    when '.rar', '.zip', '.tg' then '/javascripts/ckeditor/images/rar.gif'
    when '.xls' then '/javascripts/ckeditor/images/xls.gif'
    else '/javascripts/ckeditor/images/ckfnothumb.gif'
    end
    
    image_tag(image, :alt=>path, :title=>filename, :onerror=>"this.src='/javascripts/ckeditor/images/ckfnothumb.gif'", :class=>'image')
  end

  private
  def assemble_path(url)
    session_key = ActionController::Base.session_options[:key]

    options = {}
    controller = url

    options[:controller] = controller
    options[:protocol] = "http://"
    options[session_key] = cookies[session_key]
    options[request_forgery_protection_token] = form_authenticity_token unless request_forgery_protection_token.nil?
    options[:folder_id] = params[:folder_id]
    options[:site_id] = @site.id
    url_for(options)
  end
end
