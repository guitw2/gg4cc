// ==UserScript==
// @name         Quick Actions for Confluence Cloud
// @namespace    gg4cc
// @version      1.0
// @description  quick_actions_for_confluence
// @author       gtworkowski, halegra, nmarques
// @match        https://*.atlassian.net/wiki/*
// @run-at       document-start
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// ==/UserScript==

var quickActionsModal=`
	<div class="aui-blanket shifter-dialog-blanket" tabindex="0" aria-hidden="false"></div>
	<div class="shifter-dialog" id="shifter-dialog">
	    <form class="aui ajs-dirty-warning-exempt">
	        <div class="queryable-select" id="shifter-dialog-queryable-container" data-query="">
	            <input autocomplete="off" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-expanded="true" class="text" id="shifter-dialog-field" type="text" aria-controls="shifter-dialog-suggestions" placeholder="Find Settings..." aria-busy="false" aria-activedescendant="user-management-11"><span class="icon noloading aui-icon aui-icon-small"><span>More</span></span>
	        </div>
	        <div id="shifter-dialog-suggestions" class="aui-list" style="display: block;">
			    <div class="aui-list-scroll" tabindex="-1" role="presentation">
			        <ul id="list-results" class="aui-list-section aui-last" aria-label="Administration">
			            <li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="/wiki/admin/viewgeneralconfig.action" target="_blank">General Configuration</a></li>
			            <li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="/wiki/admin/permissions/globalpermissions.action" target="_blank">Global Permissions</a></li>
			            <li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="/wiki/admin/permissions/viewdefaultspacepermissions.action" target="_blank">Space Permissions</a></li>
			            <li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="/admin/users" target="_blank">Users</a></li>
			            <li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="/admin/groups" target="_blank">Groups</a></li>
			        </ul>
			    </div>
			</div>
	    </form>
	    <div class="hint-container overflow-ellipsis" title="Pressing period (.) opens this dialog box">Pressing period (<kbd>.</kbd>) opens this dialog box
	    </div>
	</div>
`

var quickActionsStyle=`
	<style type="text/css">
		 .aui-blanket {
		    background-color: #172b4d;
		}

		.aui-blanket[aria-hidden="false"] {
		    opacity: .5;
		    transition: opacity .2s;
		    transition-delay: .1s;
		    visibility: visible;
		}

		.aui-blanket {
		    opacity: 0;
		    transition: opacity .2s, visibility .2s;
		    transition-delay: .1s;
		    visibility: hidden;
		    background: #000;
		    height: 100%;
		    left: 0px;
		    position: fixed;
		    top: 0;
		    width: 100%;
		    z-index: 2500;
		}

		#shifter-dialog {
		    margin-top: 60px;
		    width: 360px;
		    background: #fff;
		    border-radius: 3px;
		    box-shadow: 0 8px 16px -4px rgba(9, 30, 66, .28), 0 0 1px rgba(9, 30, 66, .3);
		}

		.shifter-dialog {
		    position: fixed;
		    top: 0;
		    left: 50%;
		    width: 400px;
		    margin-left: -200px;
		    z-index: 4000;
		    border: 1px solid #e9e9e9;
		    border-top: none;
		    background: #f5f5f5;
		    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
		    overflow: hidden;
		}

		#shifter-dialog .queryable-select {
		    padding: 24px 24px 0px;
		}

		.shifter-dialog form.aui .queryable-select {
		    max-width: none;
		    padding: 15px;
		}

		form.aui .queryable-select,
		.jiraform .queryable-select {
		    width: 100%;
		    max-width: 250px;
		}

		.queryable-select {
		    box-sizing: border-box;
		    display: inline-block;
		    overflow: visible;
		    position: relative;
		}

		#shifter-dialog .queryable-select input {
		    color: #172b4d;
		    font-size: 14px;
		    font-weight: 400;
		    font-style: normal;
		    line-height: 20px;
		    background-color: #f4f5f7;
		    border: 1px solid #dfe1e6;
		    padding: 4px 7px 5px;
		}

		.shifter-dialog form.aui .queryable-select input {
		    max-width: none;
		    border: 1px solid #ccc;
		    padding: 5px;
		    padding-right: 25px;
		}

		form.aui input[type=text] {
		    height: 32px;
		    color: #172b4d;
		    font-size: 14px;
		    font-weight: 400;
		    font-style: normal;
		    line-height: 20px;
		    background-color: #f4f5f7;
		    border: 1px solid #dfe1e6;
		    padding: 4px 7px 5px;
		}

		form.aui .queryable-select>input,
		.jiraform .queryable-select>input {
		    padding-right: 28px;
		    vertical-align: baseline;
		    width: 100%;
		}

		form.aui .multi-select,
		form.aui .password,
		form.aui .select,
		form.aui .text,
		form.aui .textarea,
		form.aui .upfile {
		    color: #172b4d;
		    font-size: 14px;
		    font-weight: 400;
		    font-style: normal;
		    line-height: 20px;
		    background-color: #f4f5f7;
		    border: 1px solid #dfe1e6;
		    padding: 4px 7px 5px;
		}

		input:not([type=checkbox]):not([type=radio]),
		select,
		textarea {
		    outline: 0;
		    border-bottom-right-radius: 3.01px;
		}

		form.aui .text,
		form.aui .password,
		form.aui .select,
		form.aui .aui-select2-container .select2-choices {
		    height: 2.14285714em;
		    line-height: 1.4285714285714;
		    padding: 4px 5px;
		}

		form.aui .text,
		form.aui .password,
		form.aui .textarea,
		form.aui .select,
		form.aui .multi-select,
		form.aui .aui-select2-container .select2-choices {
		    border: 1px solid #ccc;
		    border-radius: 3.01px;
		    box-sizing: border-box;
		    font-size: inherit;
		    margin: 0;
		    max-width: 250px;
		    vertical-align: baseline;
		    width: 100%;
		}

		form.aui .text,
		form.aui .password,
		form.aui .upfile,
		form.aui .textarea,
		form.aui .select,
		form.aui .multi-select,
		form.aui .aui-select2-container {
		    background: #fff;
		    color: #333;
		    font-family: inherit;
		    font-size: 14px;
		}

		.queryable-select>input {
		    box-sizing: border-box;
		    overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
		    resize: none;
		}

		#shifter-dialog .queryable-select span.aui-icon.noloading {
		    top: 32px;
		}

		#shifter-dialog .queryable-select span.aui-icon {
		    top: 12px;
		    right: 32px;
		}
		.aui-list, .aui-list-scroll,  .dropdown-ready, .aui-list,  .aui-list-scroll,  .dropdown-ready {
		    background-color: #fff;
		    border-radius: 4px;
		}
		#shifter-dialog #shifter-dialog-suggestions.aui-list .aui-list-scroll {
		    border-top: 0;
		    max-height: 500px;
		}
		.aui-list :not(.jira-issue-status-lozenge),  .aui-list-scroll :not(.jira-issue-status-lozenge),  .dropdown-ready :not(.jira-issue-status-lozenge),  .aui-list :not(.jira-issue-status-lozenge),  .aui-list-scroll :not(.jira-issue-status-lozenge),  .dropdown-ready :not(.jira-issue-status-lozenge) {
		    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;
		    color: #172b4d;
		    font-size: 14px;
		    font-weight: 400;
		    font-style: normal;
		    line-height: 20px;
		    background-color: inherit;
		    color: #091e42;
		}
		.aui-list, .aui-list-scroll, .dropdown-ready,  .aui-list,  .aui-list-scroll,  .dropdown-ready {
		    background-color: #fff;
		    border-radius: 4px;
		}
		.shifter-dialog .aui-list .aui-list-scroll {
		    max-height: 200px;
		    overflow: auto;
		    padding: 5px 0;
		    background: white;
		    border-top: 1px solid #ccc;
		}
		.aui-list :not(.jira-issue-status-lozenge), .aui-list-scroll :not(.jira-issue-status-lozenge),  .dropdown-ready :not(.jira-issue-status-lozenge),  .aui-list :not(.jira-issue-status-lozenge),  .aui-list-scroll :not(.jira-issue-status-lozenge),  .dropdown-ready :not(.jira-issue-status-lozenge) {
		    color: #172b4d;
		    font-size: 14px;
		    font-weight: 400;
		    font-style: normal;
		    line-height: 20px;
		    background-color: inherit;
		    color: #091e42;
		}
		.shifter-dialog .aui-list .shifter-group-heading {
		    overflow: auto;
		}
		 #shifter-dialog #shifter-dialog-suggestions.aui-list .aui-list-scroll ul.aui-list-section {
		    padding-top: 0;
		}
		 .aui-list ul:last-child,  .aui-list-scroll ul:last-child,  .dropdown-ready ul:last-child,  .aui-list ul:last-child,  .aui-list-scroll ul:last-child,  .dropdown-ready ul:last-child {
		    padding-bottom: 0;
		}
		.aui-list ul:not(:first-child),  .aui-list-scroll ul:not(:first-child),  .dropdown-ready ul:not(:first-child),  .aui-list ul:not(:first-child),  .aui-list-scroll ul:not(:first-child),  .dropdown-ready ul:not(:first-child) {
		    padding-top: 10px;
		}
		.aui-list ul:last-child,  .aui-list-scroll ul:last-child,  .dropdown-ready ul:last-child,  .aui-list ul:last-child,  .aui-list-scroll ul:last-child,  .dropdown-ready ul:last-child {
		    padding-bottom: 4px;
		    border-bottom-left-radius: 4px;
		    border-bottom-right-radius: 4px;
		}
		.aui-list ul,  .aui-list-scroll ul,  .dropdown-ready ul,  .aui-list ul,  .aui-list-scroll ul,  .dropdown-ready ul {
		    border: none;
		}
		.aui-list ul {
		    list-style: none;
		    margin: 0;
		    padding: 2px 0;
		}
		.aui-list :not(.jira-issue-status-lozenge),  .aui-list-scroll :not(.jira-issue-status-lozenge),  .dropdown-ready :not(.jira-issue-status-lozenge),  .aui-list :not(.jira-issue-status-lozenge),  .aui-list-scroll :not(.jira-issue-status-lozenge),  .dropdown-ready :not(.jira-issue-status-lozenge) {
		    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;
		    color: #172b4d;
		    font-size: 14px;
		    font-weight: 400;
		    font-style: normal;
		    line-height: 20px;
		    background-color: inherit;
		    color: #091e42;
		}
		 #shifter-dialog #shifter-dialog-suggestions.aui-list .aui-list-scroll ul.aui-list-section li a,  #shifter-dialog #shifter-dialog-suggestions.aui-list .aui-list-scroll ul.aui-list-section li span.aui-list-item-message,  #shifter-dialog #shifter-dialog-suggestions.aui-list .aui-list-scroll ul.aui-list-section li span.shifter-group-context {
		    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;
		    color: #172b4d;
		    font-size: 14px;
		    font-weight: 400;
		    font-style: normal;
		    line-height: 20px;
		    padding: 8px 24px 8px;
		}
		.shifter-dialog .aui-list .aui-list-item-link {
		    cursor: pointer;
		}
		.shifter-dialog .aui-list h5, .shifter-dialog .aui-list .aui-list-item-link, .shifter-dialog .aui-list .aui-list-item-message {
		    padding-left: 15px;
		    padding-right: 15px;
		    white-space: nowrap;
		    overflow: hidden;
		    text-overflow: ellipsis;
		}
		.aui-list .aui-list-item-link {
		    display: block;
		    margin: 0;
		    padding: 3px 10px;
		    overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
		}
		#shifter-dialog .hint-container {
		    border-top: none;
		    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;
		    color: #5e6c84;
		    font-size: 12px;
		    font-weight: 600;
		    line-height: 16px;
		    padding: 16px 24px 16px;
		    color: #a5adba;
		    font-weight: 400;
		}
		.aui-list-item:hover{
			background-color: #f4f5f7;
			box-shadow: 0 0 0 2px #4c9aff inset;
		}
		kbd {
		    line-height: 16px;
		    font-size: 13px;
		    padding: 0 .3em;
		    min-width: 0;
		    box-sizing: border-box;
		    background-color: #f7f7f7;
		    border: 1px solid #ccc;
		    border-radius: 3px;
		    box-shadow: 0 1px 0 rgba(0,0,0,0.2), 0 0 0 2px #fff inset;
		    color: #333;
		}
	</style>
`

var	spaceKey=null;
var	insideSpace=false;

function refreshLinks(){

	if(window.location.href.match("/spaces/(.+)/")){ //if inside a space, get the space key
		spaceKey=window.location.href.match("/spaces/(.+)/")[1].split("/")[0];
		insideSpace=true;
	}
	else if(window.location.href.match("key=(.+)")){
		spaceKey=window.location.href.match("key=(.+)")[1];
		insideSpace=true;
	}

	console.log(insideSpace);
	console.log(spaceKey)

	// title, link, keywords, link inside of a space?
	links=[["General Configuration","/wiki/admin/viewgeneralconfig.action","site configuration internal attachment size formatting international date title general settings",false],
	    ["Global Permissions","/wiki/admin/permissions/globalpermissions.action","global permissions permission anonymous",false],
	    ["Security Configuration","/wiki/admin/viewsecurityconfig.action","security security configuration",false],
	    ["All Space Permissions","/wiki/admin/permissions/viewdefaultspacepermissions.action","space permissions permission recover manage",false],
	    ["Further Configuration","/wiki/admin/viewspacesconfig.action","homepage thread comment like draft quick navigation further configuration settings",false],
	    ["Language Configuration","/wiki/admin/viewlanguage.action","default language language configuration idiom",false],
	    ["Shortcut Links","/wiki/admin/browseshortcuts.action","shortcut link links",false],
	    ["Global Templates and Blueprints ","/wiki/pages/templates2/listglobaltemplates.action","template pages spaces blueprint  global templates and blueprints ",false],
	    ["Space Directory","/wiki/spacedirectory/view.action","space directory spaces",false],
	    ["Delete Space ","/wiki/spaces/removespace.action?key="+spaceKey,"delete space",true],
	    ["Permissions","/wiki/spaces/spacepermissions.action?key="+spaceKey,"permissions permission ",true],
	    ["Import Templates ","/wiki/admin/plugins/templatePackage/configurePlugin.action","import templates template",false],
	    ["Export","/wiki/spaces/exportspacewelcome.action?key="+spaceKey,"export space",true],
	    ["HTML Export","/wiki/spaces/exportspacewelcome.action?key="+spaceKey,"html export space",true],
	    ["XML Export ","/wiki/spaces/exportspacewelcome.action?key="+spaceKey,"xml export space",true],
	    ["Manage apps","/wiki/plugins/servlet/upm?source=side_nav_manage_addons","manage apps marketplace add on add-on extension extension app integration integrations",false],
	    ["Find New Apps","/wiki/plugins/servlet/ac/com.atlassian.confluence.emcee/discover","find new apps marketplace add on add-on extension extension app integration integrations",false],
	    ["PDF Export Language Support","/wiki/admin/flyingpdf/configurepdflanguagesupport.action","pdf export language support idiom",false],
	    ["Backup Manager","/wiki/plugins/servlet/ondemandbackupmanager/admin","backup manager restore export",false],
	    ["Code Macro Administration","/wiki/admin/plugins/newcode/configure.action","code macro administration code java html php",false],
	    ["Slack","/wiki/plugins/atlassian-connect/space-tools-tab.action?key="+spaceKey+"&addonKey=confluence-chats-integration&moduleKey=space-config-link","slack space",true],
	    ["Users","/admin/users","users user people",false],
	    ["Groups ","/admin/groups","groups group",false],
	    ["Content Indexing","/wiki/admin/search-indexes.action","content reindex index indexing",false],
	    ["Themes","/wiki/admin/choosetheme.action","global themes theme customization custom layout space",false],
	    ["Color Scheme","/wiki/admin/lookandfeel.action","color scheme colors customization custom space",false],
	    ["PDF Layout ","/wiki/admin/flyingpdf/viewpdflayoutconfig.action","pdf layout formatting title page header footer space css",false],
	    ["PDF Stylesheet","/wiki/admin/flyingpdf/viewpdfstyleconfig.action","pdf stylesheet export space css",false],
	    ["Site Logo and Favicon","/wiki/admin/sitelogo/view-sitelogo.action","site logo favicon icon avatar title",false],
	    ["Header and Footer","/wiki/admin/custompagecontent.action","header footer site look",false],
	    ["Default Space Logo ","/wiki/admin/configuredefaultspacelogo.action","default space logo",false],
	    ["Macro Usage","/wiki/admin/pluginusage.action","macro usage macros",false],
	    ["Audit Log","/wiki/admin/auditlogging.action","audit log logs",false],
	    ["Import Spaces","/wiki/admin/importspace/importconfluencespace.action","import space spaces xml export",false],
	    ["Application Links","/wiki/plugins/servlet/applinks/listApplicationLinks","application links applications link",false],
	    ["JIRA Macro Repair","/wiki/admin/jim-validator/view.action","jira macro repair",false],
	    ["Application Navigator","/wiki/plugins/servlet/customize-application-navigator","application navigator links applications link quick access",false],
	    ["Space Settings ","/wiki/spaces/viewspacesummary.action?key="+spaceKey,"space settings",true],
	    ["Restrictions","/wiki/pages/listpermissionpages.action?key="+spaceKey,"restrictions restriction",true],
	    ["Template","/wiki/pages/templates2/listpagetemplates.action?key="+spaceKey,"space template templates blueprint",true],
	    ["Reorder pages","/wiki/pages/reorderpages.action?key="+spaceKey,"reorder page pages",true],
	    ["Orphaned Pages","/wiki/pages/listorphanedpages.action?key="+spaceKey,"orphaned page pages",true],
	    ["Undefined Pages","/wiki/pages/listundefinedpages.action?key="+spaceKey,"undefined page pages",true],
	    ["Attachments","/wiki/spaces/listattachmentsforspace.action?key="+spaceKey,"attachment attachments space file files",true],
	    ["Trash","/wiki/pages/viewtrash.action?key="+spaceKey,"trash deleted delete page restore",true],
	    ["PDF Export","/wiki/spaces/exportspacewelcome.action?key="+spaceKey,"pdf export space",true],
	    ["RSS Feed","/wiki/spaces/listrssfeeds.action?key="+spaceKey,"rss feed feeds space",true],
	    ["Themes","/wiki/spaces/choosetheme.action?key="+spaceKey,"space theme themes",true],
	    ["PDF Layout","/wiki/spaces/flyingpdf/viewpdflayoutconfig.action?key="+spaceKey,"space pdf layout",true],
	    ["Stylesheet","/wiki/spaces/flyingpdf/viewpdfstyleconfig.action?key="+spaceKey,"space stylesheet",true],
	    ["Header & Footer","/wiki/spaces/custompagecontent.action?key="+spaceKey,"header footer header and footer space",true],
	    ["PDF Stylesheet","/wiki/spaces/flyingpdf/viewpdfstyleconfig.action?key="+spaceKey,"pdf stylesheet stylesheets",true],
	    ["Integrations ","/wiki/spaces/listentitylinks.action?typeId=com.atlassian.applinks.api.application.confluence.ConfluenceSpaceEntityType&key="+spaceKey,"integrations space integration",true],
	    ["App Links","/wiki/spaces/listentitylinks.action?typeId=com.atlassian.applinks.api.application.confluence.ConfluenceSpaceEntityType&key="+spaceKey,"application application links application link links space link",true],
	    ["People","/people/search","people directory profiles",false],
	    ["Recently Worked on","/wiki/my/recent-work","recently worked on recent last previous",false],
	    ["Recently Visited","/wiki/my/recently-visited","recently visited recent view viewed",false],
	    ["Drafts","/wiki/my/drafts","drafts sketch",false],
	    ["Saved for Later","/wiki/my/saved-for-later","saved for later star starred bookmark bookmarked",false],
	    ["Online help","https://confluence.atlassian.com/display/ConfCloud/","online help documentation",false],
	    ["Recommended Updates Email ","/wiki/admin/dailysummary/admin.action","recommended updates notification email",false],
	    ["Feed Builder","/wiki/dashboard/configurerssfeed.action","feed builder rss",false],
	    ["Site Status","https://status.atlassian.com/","site status system down help",false],
	    ["What's New","https://confluence.atlassian.com/cloud/blog","what's new blog post",false],
	    ["Terms of Service ","http://www.atlassian.com/hosted/terms.jsp","terms service security legal privacy policy policies gdpr data",false],
	    ["Privacy Policy","https://www.atlassian.com/legal/privacy-policy","privacy policy security legal policies gdpr data",false],
	    ["Get the Mobile app","https://confluence.app.link/lXR9osLBRC","get the mobile app application",false]];
}

var modalOn = false;

function orderResults(similarityObj){
	var resultArray=[]
	var similarityArray=Object.entries(similarityObj);
	for(var i=5;i>0;i-=1){
		for(var j=0;j<similarityArray.length;j++){
			if((similarityArray[j][1]>i-1)&&(similarityArray[j][1]<=i)){
				resultArray.push(similarityArray[j][0]);
			}
			if(resultArray.length>4){
				console.log("maior que 4");
				return resultArray;
			}
		}
	}
	return resultArray;
}

$( window ).on("load", function(){
	$("head").append(quickActionsStyle);
	$( window ).keypress(function( e ) {
		if(e.charCode == 46 && !modalOn){
			refreshLinks();
			modalOn=true;
			$("body").append(quickActionsModal);
			$("#shifter-dialog").focus();
			$("body").keydown(function(){
				$("#shifter-dialog-field").focus();
	            $("#shifter-dialog-field").keyup(function(){ //typing on the user input
	                var queryText=$("#shifter-dialog-field").val();
	                if(queryText.length>=3){
	                	$("#list-results").html("");
	                	var eachKeySearch = queryText.split(" ");
	                	var similarityObj = {};
	                	for(var i=0;i<links.length;i++){
	                		var keyWords=links[i][2].split(" ");
	                		var similarity=0;
	                            for(var k=0; k<eachKeySearch.length; k++){
	                            	if(!insideSpace && links[i][3]){
	                            		break;
	                            	}
	                            	if(links[i][2].includes(eachKeySearch[k])){
	                            		if(similarity<5){ //limit max similarity to 5
	                            			similarity++;
	                            		}
	                            	}
	                            }
	                		similarityObj[links[i]]=similarity;
	                	}
	                	var relevantResults=orderResults(similarityObj);
	                	for(var l=0;l<relevantResults.length;l++){
	                		$("#list-results").append(`<li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="`+relevantResults[l].split(",")[1]+`" target="_blank">`+relevantResults[l].split(",")[0]+`</a></li>`);
	                	}
	                }
	                else{
	                	$("#list-results").html(`<li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="/wiki/admin/viewgeneralconfig.action" target="_blank">General Configuration</a></li>
			            <li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="/wiki/admin/permissions/globalpermissions.action" target="_blank">Global Permissions</a></li>
			            <li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="/wiki/admin/permissions/viewdefaultspacepermissions.action" target="_blank">Space Permissions</a></li>
			            <li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="/admin/users" target="_blank">Users</a></li>
			            <li class="aui-list-item" role="option"><a class="aui-list-item-link" role="presentation" href="/admin/groups" target="_blank">Groups</a></li>`)
	                }
	            });
        	});
			$(".aui-blanket").click(function(){
				$(".aui-blanket").remove();
				$("#shifter-dialog").remove();
				modalOn=false;
			});
		}
  	});
});