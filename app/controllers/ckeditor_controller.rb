class CkeditorController < ApplicationController
  before_filter :swf_options, :only=>[:_images, :_files, :create]
  session :cookie_only => false, :only => :create
  
  layout "ckeditor"
  
  # GET /ckeditor/images
  def images
    
    @tag = Tag.new
    @tags = @site.tags.find_all_by_tag_type_id(TagType['AssetPicture'], :order => :position)

    #@images = @images = Asset.find_tagged_with(@tag.name) || @site.asset_pictures
    respond_to do |format|
      format.html { render :layout => "folders"}
    end
  end

  def _images
    @tag = Tag.find(params[:folder_id]) if params[:folder_id]
    @tags = @site.tags.find_all_by_tag_type_id(TagType['AssetPicture'], :order => :position)
    if @tag
      @images = @site.asset_pictures.find_tagged_with(@tag.name) || @site.asset_pictures
    else
      @images = @site.asset_pictures
    end

    respond_to do |format|
      format.html {}
      format.xml { render :xml=>@images }
    end

  end
  # GET /ckeditor/files
  def files
    @tag = Tag.new
    @tags = @site.tags.find_all_by_tag_type_id(TagType['AssetFile'], :order => :position)
    
    respond_to do |format|
      format.html {render :layout => "folders"}
      format.xml { render :xml=>@files }
    end
  end

  def _files
    @tag = Tag.find(params[:folder_id]) if params[:folder_id]
    @tags = @site.tags.find_all_by_tag_type_id(TagType['AssetFile'], :order => :position)
    if @tag
      @files = @site.asset_files.find_tagged_with(@tag.name) || @site.asset_files
    else
      @files = @site.asset_files
    end

    respond_to do |format|
      format.html {}
      format.xml { render :xml=>@files }
    end
  end
  # POST /ckeditor/create
  def create
    @kind = params[:kind] || 'file'
    @tag = Tag.find(params[:folder_id]) if params[:folder_id]
    
    @record = case @kind.downcase
    when 'file'  then AssetFile.new
    when 'image' then AssetPicture.new
	  end
	  
	  unless params[:CKEditor].blank?	  
	    params[@swf_file_post_name] = params.delete(:upload)
	  end
	  
	  options = {}
	  
	  params.each do |k, v|
	    key = k.to_s.downcase
	    options[key] = v if @record.respond_to?("#{key}=")
	  end
    
    @record.attributes = options
    @record.site = @site
    @record.user = current_user
    @record.tag_list = @tag.name if @tag
    
    #if @record.valid? && @record.save
    if @record.save!
      @text = params[:CKEditor].blank? ? @record.to_json(:only=>[:id, :type], :methods=>[:url, :content_type, :size, :filename, :format_created_at]) : %Q"<script type='text/javascript'>
        window.parent.CKEDITOR.tools.callFunction(#{params[:CKEditorFuncNum]}, '#{escape_single_quotes(@record.url(:content))}');
      </script>"
      
      render :text=>@text
    else
      render :nothing => true
    end
  end

  def create_image_folder
    @origin_tag = Tag.find(:first, :conditions => ["data_source_id = ? and data_source_type =? and tag_type_id =? and name =?",
        @site.id, @site.class.name, TagType['AssetPicture'], params[:tag][:name]])
    if @origin_tag
      render :text => ""
    else
      @tag = Tag.find_or_create_with_like_by_name(params[:tag][:name], @site.id, @site.class.name, TagType['AssetPicture'].id)

      render :create_folder
    end
  end

  def create_file_folder
    @origin_tag = Tag.find(:first, :conditions => ["data_source_id = ? and data_source_type =? and tag_type_id =? and name =?",
        @site.id, @site.class.name, TagType['AssetFile'], params[:tag][:name]])
    if @origin_tag
      render :text => ""
    else
      @tag = Tag.find_or_create_with_like_by_name(params[:tag][:name], @site.id, @site.class.name, TagType['AssetFile'].id)
    
      render :create_folder
    end
  end

  def delete_asset
    asset_ids = params[:ids].split(",")
    asset_ids.each do |id|
      Asset.find(id).destroy
    end

    render :text => "OK"
  end

  def delete_folder
    folder = Tag.find(params[:folder_id])
    folder.destroy

    render :text => "OK"
  end

  def rename_folder
    folder = Tag.find(params[:folder_id])
    folder.name = params[:new_folder_name]
    folder.save
    folder.reload
    render :text => folder.name
  end
  
  def move_asset
    asset_ids = params[:ids].split(",")
    new_folder_id = params[:new_folder_id]
    asset_ids.each do |id|
      asset = Asset.find(id)
      asset.tag_list = Tag.find(new_folder_id).name
      asset.save
    end

    render :text => "OK"
  end


  private
    
  def swf_options
    if Ckeditor::Config.exists?
      @swf_file_post_name = Ckeditor::Config['swf_file_post_name']
        
      if params[:action] == '_images'
        @file_size_limit = Ckeditor::Config['swf_image_file_size_limit']
        @file_types = Ckeditor::Config['swf_image_file_types']
        @file_types_description = Ckeditor::Config['swf_image_file_types_description']
        @file_upload_limit = Ckeditor::Config['swf_image_file_upload_limit']
      else
        @file_size_limit = Ckeditor::Config['swf_file_size_limit']
        @file_types = Ckeditor::Config['swf_file_types']
        @file_types_description = Ckeditor::Config['swf_file_types_description']
        @file_upload_limit = Ckeditor::Config['swf_file_upload_limit']
      end
    end
      
    @swf_file_post_name ||= 'data'
    @file_size_limit ||= "5 MB"
    @file_types ||= "*.jpg;*.jpeg;*.png;*.gif"
    @file_types_description ||= "Images"
    @file_upload_limit ||= 10
  end
    
  def escape_single_quotes(str)
    str.gsub('\\','\0\0').gsub('</','<\/').gsub(/\r\n|\n|\r/, "\\n").gsub(/["']/) { |m| "\\#{m}" }
  end
  
end
