function diy_tools () {
        var diy__hostname = "arduino.os.cs.teiath.gr";
        this.https_url = "https://"+diy__hostname;
        this.wss_url = "wss://"+diy__hostname;
        this.client_id = "user";
        this.client_secret = "user";
        this.device = "";
        this.diy_editor = {};   	// editor instance
        this.diy_editor_properties= {};	// properties for editor instance
        this.editor_filemode = "";	// filemode    sketch / lib
        
        
        //declare plot engine
        this.plotengine = '';
        this.timelinelist = 0;
        
        //array with timestamp, array with time in seconds, counter
        //currenttime and currenty are the last timestamp and last measurement
        //unitofmeasurement declares units, plottitle declares plot title/description (to be realized)
        this.datatimestamp = [];
        this.datatime = [];
        this.i = 0;
        this.currenttime = 0;
        this.currenty = 0;
        this.unitofmeasurement = "volts";
        this.plottitle = 'Light Sensor Measurements';

}
// ***GIT*** 
// ***GitGit*** 
// var data="grant_type=client_credentials&client_id="+username+"&client_secret="+password;
/*
 * get token from server
 * return access_token
 */
/*
diy_tools.prototype.getToken = function()  {
    	var subject = this;
	$.ajax({
		type: "POST",
		url: this.https_url+'/api/token',
		dataType: "json",
		data: {
			'grant_type': 'client_credentials', 
			'client_id': this.client_id, 
			'client_secret': this.client_secret
		},
		success: function(response) {
			//var result = $.parseJSON(response);
			var result = response;
			return result.access_token;
		},
		error: function(response) {
			var result =  $.parseJSON(response);
			return result;
			console.log(response);
		}
	});
}

*/
                   // Create Base64 Object
diy_tools.prototype.base64 = function()  {
                                 return  Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
}
		   
diy_tools.prototype.getToken = function()  {
    var subject = this;
    var dfd = $.Deferred();
    var performAjaxRequest = function() {
        return $.ajax({
                type: "POST",
                url: subject.https_url+'/api/token',
                dataType: "json",
                data: {
                    'grant_type': 'client_credentials', 
                    'client_id': subject.client_id, 
                    'client_secret': subject.client_secret
                }
        });
    }
    // If no credentials are saved show a modal dialog
    var savedUsername = localStorage.getItem("username");
    var savedPassword = localStorage.getItem("password");
    if(savedUsername == null || savedPassword == null) {
        $("<div><div><input id='username' type='text' placeholder='Username' /></div><div><input id='password' type='password' placeholder='Password' /></div></div>").dialog({
            dialogClass: "no-close",
            buttons: [
                {
                    text: "Login",
                    click: function() {
                        subject.client_id = $(this).find('#username').val();
                        subject.client_secret = $(this).find('#password').val();
                        var $this = $(this);
                        performAjaxRequest().done(function(data) {
                            // Save them in storage
                            if(typeof data.access_token != 'undefined') {
                                $this.dialog( "close" );
                                localStorage.setItem("username", subject.client_id);
                                localStorage.setItem("password", subject.client_secret);
                                dfd.resolve(data);
                            } else {
                                alert('Invalid credentials');
                            }
                        });
                    }
                }
            ]
        });
    } else {
        subject.client_id = savedUsername;
        subject.client_secret = savedPassword;
        performAjaxRequest().done(function(data) {
            if(typeof data.access_token != 'undefined') {
                dfd.resolve(data);
            } else {
                subject.client_id = null;
                subject.client_secret = null;
                localStorage.removeItem("username");
                localStorage.removeItem("password");
                var newdfd = subject.getToken();
                newdfd.done(function(data) { dfd.resolve(data); });
            }
        });
    }
    return dfd;
}

/*
 * open wss 
 * required access_token
 * return wss connection 
 */
diy_tools.prototype.wss_connect = function()  {
    	var subject = this;
    	var conn = new ab.Session(this.wss_url+'?access_token='+this.access_token,
		function() {
			var device = new Object();
			device.access_token = subject.access_token;
			device.name = subject.device;
			devicestr = JSON.stringify(device);
			
			subject.plotengine = $("[name='plotengineselection']").val();
			subject.timelinelist = parseInt( $("[name='listformat']").val() );
			$("[name='deviceselection']").attr('disabled', 'disabled');
			$("[name='plotengineselection']").attr('disabled', 'disabled');
			$("[name='listformat']").attr('disabled', 'disabled');
			$("#gobutton").attr('disabled', 'disabled');
			
			if (subject.timelinelist == 0)
			{
				$("#listheaders").append( "<tr><td>No.</td><td>Time (s)</td><td>Value (" + subject.unitofmeasurement + ")</td></tr>" );
			}
			else if (subject.timelinelist == 1)
			{
				$("#listheaders").append( "<tr><td>No.</td><td>Time Stamp</td><td>Value (" + subject.unitofmeasurement + ")</td></tr>" );
			}
			else if (subject.timelinelist == 2)
			{
				$("#listheaders").append( "<tr><td>No.</td><td>Time Stamp</td><td>Time (s)</td><td>Value (" + subject.unitofmeasurement + ")</td></tr>" );
			}
			
			if (subject.plotengine != "")
			{
				$LAB
				.script(subject.plotengine).wait()
				.wait(function(){
					if (subject.timelinelist == 3)
					{
						$("#dataDev").hide();
					}
					else
					{ 
						$("#dataDev").css("height", "180px"); 
						$("#dataDev").css("overflow", "auto"); 
					}
					initplot(subject);

					//connect and wait for data
					conn.subscribe(subject.device, function(topic, data) {
						addmeasurement(subject, data);
					});
				});
			}
			else
			{
				$("#plotcontainer").hide();
				$("#dataDev").css("height", "auto"); 
				$("#dataDev").css("overflow", "visible"); 
				
				//connect and wait for data
				conn.subscribe(subject.device, function(topic, data) {
					addmeasurement(subject, data);
				});
			}
		},
		function() {
			console.warn('WebSocket connection closed');
		},
		{
			'skipSubprotocolCheck': true
		}
	);
}

function addmeasurement(subject, data){
	//---receive data, count measurements, pass data to arrays---
	subject.currenttime = parseInt(data.when)*1000;
	subject.currenty = Math.round(100*parseFloat(data.data)*5/1023)/100;
	subject.datatimestamp.push([ subject.currenttime, subject.currenty ]);
	subject.datatime.push([ (subject.currenttime-subject.datatimestamp[0][0])/1000, subject.currenty ]);
	subject.i = subject.i + 1;

	if (subject.plotengine != ""){
		addplotpoint(subject);
	}
		
	//add to list
	if (subject.timelinelist == 0)
	{
		$("#listtable").append( "<tr><td>" + subject.i + "</td><td>" + subject.datatime[subject.i-1][0] + " s</td><td>" + subject.datatime[subject.i-1][1] + " " + subject.unitofmeasurement + " </td></tr>" );
	}
	else if (subject.timelinelist == 1)
	{
		var d = new Date(subject.datatimestamp[subject.i-1][0]);
		$("#listtable").append( "<tr><td>" + subject.i + "</td><td>" + d + "</td><td>" + subject.datatime[subject.i-1][1] + " " + subject.unitofmeasurement + " </td></tr>" );
	}
	else if (subject.timelinelist == 2)
	{
		var d = new Date(subject.datatimestamp[subject.i-1][0]);
		$("#listtable").append( "<tr><td>" + subject.i + "</td><td>" + d + "</td><td>" + subject.datatime[subject.i-1][0] + " s</td><td>" + subject.datatime[subject.i-1][1] + " " + subject.unitofmeasurement + " </td></tr>" );
	}
}

/*
 * get devices from server
 * required access_token
 * return user devices 
 */
diy_tools.prototype.getDevices = function()  {
    	var subject = this;
	return $.ajax({
		type: "GET",
		url: this.https_url+'/api/devices',
		dataType: "json",
		data: {
			'access_token': this.access_token
		}
	});
}


/*
 * compile
 * required access_token
 * device
 * srcfile
 * filename
 * comp
 * writedevice
 * return user devices 
 * srclib optional
 */
diy_tools.prototype.compile = function()  {
    	var subject = this;
	return $.ajax({
		type: "POST",
		url: this.https_url+'/api/compile',
		dataType: "json",
		data: {
			'access_token': this.access_token,
			'device': this.device,
			'srcfile': this.srcfile,
			'srclib': this.srclib,
			'filename': this.filename,
			'comp': this.comp,
			'writedevice': this.writedevice
		}
	});
}

diy_tools.prototype.editor = function(str,nr,filename)  {
  var editordom=nr;
    this.diy_editor_properties['diy_code_'+editordom+'_'+this.editor_filemode]={};
    this.diy_editor_properties['diy_code_'+editordom+'_'+this.editor_filemode]["name"]=filename;
  $("#"+editordom).append('<div id="diy_div_'+editordom+'"><textarea id="diy_code_'+editordom+'" name="'+this.editor_filemode+'" class="diy_code"  cols="150" rows="50"></textarea></div>');
    this.diy_editor['diy_code_'+editordom+'_'+this.editor_filemode] = CodeMirror.fromTextArea(document.getElementById("diy_code_"+editordom), {
	mode: { 
		name: "javascript", 
		globalVars: true
	},
	lint: true,
	lineNumbers: true,
	theme: "default",
	tabMode: "indent",
	gutters: ["CodeMirror-lint-markers"],
	matchBrackets: true,
	onBlur: function(){
		editor.save();
	},
	onChange: function(){
		$("#changeimg").show();
	}, 
	extraKeys: {
		'Cmd-/' : 'toggleComment',
		'Ctrl-/' : 'toggleComment',
		"Ctrl-Space": "autocomplete",
		"F11": function(cm) {
			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
		},
		"Esc": function(cm) {
			if (cm.getOption("fullScreen")) 
				cm.setOption("fullScreen", false);
			}
		},
	path: 'js/', 
	searchMode: 'inline',
	onCursorActivity: function () {
		editor.setLineClass(hlLine, null);
		hlLine = editor.setLineClass(editor.getCursor().line, "activeline");
	}
    });
    this.diy_editor['diy_code_'+editordom+'_'+this.editor_filemode].setValue(str);
}
