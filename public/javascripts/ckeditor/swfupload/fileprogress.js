/* ******************************************
 *	FileProgress Object
 *	Control object for displaying file info
 * ****************************************** */

function make_file_thumb(){
    $('div.FCKThumb').mouseover(function(){
        $(this).addClass('FCKSelectedBox');
    });
    $('div.FCKThumb').mouseleave(function(){
        $(this).removeClass('FCKSelectedBox');
    });
    $('div.FCKThumb').click(function(){
        image = $('img', this);
        setUrl(image.attr('alt'));
    });
}

function FileProgress(file, targetID) {
    this.fileProgressID = "divFileProgress";

    this.fileProgressWrapper = document.getElementById(this.fileProgressID);
    if (!this.fileProgressWrapper) {
        this.fileProgressWrapper = document.createElement("div");
        this.fileProgressWrapper.className = "progressWrapper";
        this.fileProgressWrapper.id = this.fileProgressID;

        this.fileProgressElement = document.createElement("div");
        this.fileProgressElement.className = "progressContainer";

        var progressCancel = document.createElement("a");
        progressCancel.className = "progressCancel";
        progressCancel.href = "#";
        progressCancel.style.visibility = "hidden";
        progressCancel.id = "btnCancel";
        progressCancel.appendChild(document.createTextNode(" "));

        var progressText = document.createElement("div");
        progressText.className = "progressName";
        progressText.appendChild(document.createTextNode(file.name));

        var progressBar = document.createElement("div");
        progressBar.className = "progressBarInProgress";

        var progressStatus = document.createElement("div");
        progressStatus.className = "progressBarStatus";
        progressStatus.innerHTML = "&nbsp;";

        this.fileProgressElement.appendChild(progressCancel);
        this.fileProgressElement.appendChild(progressText);
        this.fileProgressElement.appendChild(progressStatus);
        this.fileProgressElement.appendChild(progressBar);

        this.fileProgressWrapper.appendChild(this.fileProgressElement);

        document.getElementById(targetID).appendChild(this.fileProgressWrapper);
    //fadeIn(this.fileProgressWrapper, 0);

    } else {
        this.fileProgressElement = this.fileProgressWrapper.firstChild;
        this.fileProgressElement.childNodes[1].firstChild.nodeValue = file.name;
    }

    this.height = this.fileProgressWrapper.offsetHeight;

}
FileProgress.prototype.setProgress = function (percentage) {
    this.fileProgressElement.className = "progressContainer green";
    this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
    this.fileProgressElement.childNodes[3].style.width = percentage + "%";
};
FileProgress.prototype.setComplete = function () {
    this.fileProgressElement.className = "progressContainer blue";
    this.fileProgressElement.childNodes[3].className = "progressBarComplete";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setError = function () {
    this.fileProgressElement.className = "progressContainer red";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setCancelled = function () {
    this.fileProgressElement.className = "progressContainer";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setStatus = function (status) {
    this.fileProgressElement.childNodes[2].innerHTML = status;
};

FileProgress.prototype.toggleCancel = function (show, swfuploadInstance) {
    this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
    if (swfuploadInstance) {
        var fileID = this.fileProgressID;
        this.fileProgressElement.childNodes[0].onclick = function () {
            swfuploadInstance.cancelUpload(fileID);
            return false;
        };
    }
};

FileProgress.prototype.createThumbnail = function(serverData) {
    //var object = JSON.decode(serverData);
    eval('var myobj='+serverData);
    var container = $('#container');
  
    var image_src = null;
    var image_alt = null;
    var file_size = null;
    var file_name = null;
    var file_date = null;
    var asset = (typeof myobj.asset_picture != 'undefined') ? myobj.asset_picture : myobj.asset_file;
  
    if (typeof asset == 'undefined')
        return;
  
    image_alt = asset.url;
    file_size = asset.size;
    file_name = asset.filename;
    file_date = asset.format_created_at;
  
    switch(asset.type.toLowerCase())
    {
        case "assetpicture":
            image_src = myobj.asset_picture.url_thumb;
            image_alt = myobj.asset_picture.url_content;
      
            break;
        case "assetfile" :
            image_src = '/javascripts/ckeditor/images/ckfnothumb.gif';
    
            if (file_name.indexOf('.swf') != -1)
            {
                image_src = '/javascripts/ckeditor/images/swf.gif';
            }
            else if (file_name.indexOf('.pdf') != -1)
            {
                image_src = '/javascripts/ckeditor/images/pdf.gif';
            }
            else if (file_name.indexOf('.xls') != -1)
            {
                image_src = '/javascripts/ckeditor/images/xls.gif';
            }
            else if (file_name.indexOf('.doc') != -1)
            {
                image_src = '/javascripts/ckeditor/images/doc.gif';
            }
            else if (file_name.indexOf('.mp3') != -1)
            {
                image_src = '/javascripts/ckeditor/images/mp3.gif';
            }
            else if (file_name.indexOf('.rar') != -1)
            {
                image_src = '/javascripts/ckeditor/images/rar.gif';
            }
            break;
    }
  
    var div = $(document.createElement('div'));
    div.addClass('FCKThumb');
  
    var table = $(document.createElement('TABLE'));
    table.append($(document.createElement("TBODY")));
    table.attr('border',0);
    table.attr('cellspacing', 0);
    table.attr('cellpadding', 0);
    table.attr('width', 100);
    table.attr('height', 100);
  
    //var row = table.tBodies[0].insertRow(0);
    //var cell = row.insertCell(row.cells.length);
  
    $('tbody', table).append("<tr><td><img src='" + image_src + "' alt='" + image_alt + "' title='" + file_name + "' class='image' onerror=\"this.src='/javascripts/ckeditor/images/ckfnothumb.gif'\" /></td></tr>");
  
    var div_name = $(document.createElement('DIV'));
    div_name.addClass("FCKFileName");
    div_name.html(file_name);
  
    var div_date = $(document.createElement('DIV'));
    div_date.addClass("FCKFileDate");
    div_date.html(file_date);
  
    var div_size = $(document.createElement('DIV'));
    div_size.addClass("FCKFileSize");
    div_size.html(file_size);
  
    div.append(table);
    div.append(div_name);
    div.append(div_date);
    div.append(div_size);
  
    //container.appendChild(div);
    div.mouseover(function(){
        div.addClass('FCKSelectedBox');
    });
    div.mouseleave(function(){
        div.removeClass('FCKSelectedBox');
    });
    div.click(function(){
        image = $('img', this);
        setUrl(image.attr('alt'));
    });
    div.prependTo(container);
};
