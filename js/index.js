
//now what?
	// sample org id's: 1, 2, 1001
	/*if they enter an orgId (we will get it next class through a search), we need to find:
		-What different areas of information the organization has (/Application/Tabs?orgId=x)
		-then, find each area on demand (each will need it's own call)
			General
				Path: ...ESD/{orgId}/General
			Locations
				Path: ...ESD/{orgId}/Locations
			Treatment
				Path: ...ESD/{orgId}/Treatments
			Training
				Path: ...ESD/{orgId}/Training
			Facilities
				Path: ...ESD/{orgId}/Facilities
			Equipment
				Path: ...ESD/{orgId}/Equipment
			Physicians
				Path: ...ESD/{orgId}/Physicians
			People
				Path: ...ESD/{orgId}/People
	*/
	

//-----------------------------------//GET ORG TYPES--//-----------------------	
function getOrgTypes() {
  $.ajax({
    type:'GET',
    async:true,
    cache:false,
    url: 'proxy.php',
    data: {path: "/OrgTypes"},
    dataType: 'xml',
    success: function(data,status) {
      var x='';
      if ($(data).find('error').length != 0) {
              //do something or nothing?
      }
      else {
        x+='<select value="">';
        $('row',data).each(
          function() {
                  x+='<option value="'+$(this).find('type').text()+'">'+
                          $(this).find('type').text()+'</option>';
          }
        );
	 x+='</select>';
        $('#orgType').html(x);
      }//end of else
    }//end of success
  });//end of ajax
}//end getOrgTypes
//-----------------------------------------------GET Tabs FROM INFO SELECT
function getTabs(id) {
  //for any organization, figure out how many 'tabs' it has
  $.ajax({
    type:'get',
    async:true,
    url:'proxy.php',
    data: {path: "/Application/Tabs?orgId=" + id },
    success: function(data,status) {
    if($(data).find('error').length!=0) {
	    //output some error message
    }
    else {
    //for each <Tab> in data
    //<ul id="menu">
    //  <li class="active"><a href="#contentHome">Home</a></li>
    //  <li><a href="#contentGuestbook">Guestbook</a></li>
    //  <li><a href="#contentLinks">Links</a></li>
    //</ul>
    //<div class="content" id="contentHome">Content for Home</div>
    //<div class="content" id="contentGuestbook">My guestbook</div>
    //<div class="content" id="contentLinks">Links</div>

    alert(this);
  $('Tab',data).each(function() {
	x += '<li class ="active"><a href="#'+$(this).text()+'" onclick="get'+$(this).text()+'(this)";>'+$(this).text()+'</a></li>';
});
    //dump it out
    $('#dump').html(x+'</select>');
    //getGeneral(id);
    }//else
    } //success function
  });//ajax
}//getTabs
//-------------------------------------------------------------//---GENERAL--//---------------->>	
function getGeneral(id) {
  $.ajax({
    type:'get',
    url:'proxy.php',
    data:{path:'/'+id+'/General'},
    dataType: 'xml',
    success: function(data) {
      if ($(data).find('error').length!=0) {
	      //do some type of error message
      } else {
	alert('id is ' + id);
      //add header 'General Information'
        $('#resultsTitle').html('<h2>General Information</h2>');
      //make a table
      var x ='<table><tr><td>Name:</td><td>'+$(data).find('name').text()+'</td></tr>';
      x+='<tr><td>Description:</td><td>'+$(data).find('description').text()+'</td></tr>';
      x+='<tr><td>Email:</td><td>'+$(data).find('email').text()+'</td></tr>';
      x+='<tr><td>Website:</td><td>'+$(data).find('website').text()+'</td></tr>';
      x+='<tr><td>Number of Members:</td><td>'+$(data).find('nummembers').text()+'</td></tr>';
      x+='<tr><td>Number of Calls:</td><td>'+$(data).find('numcalls').text()+
		'</td></tr></table>';
		
      $('#output').html( x);
      }//end else
    }//end success
  });//end ajax
}//end getGeneral

////-------------------------------------------------------------//---SELECT LIST OF LOCATION TYPES--//---------------->>
//////finds the types of locations
//////pastes them to div id "locationsSearch"
//function getLocationTypes(){
//  $.ajax ({
//  type: 'GET',
//  async: true,
//  cache: false,
//  url: 'proxy.php',
//  data: {path: "/LocationTypes?"},
//  dataType: 'xml',
//  success: function(data,status) {
//              var x='';
//              else {
//              x += '<select id="locationType" name="localType" onclick="getLocations(this.val);">';
//              $('type',data).each(
//                function() {
//                  x+='<option value="'+$(this).text()+'">'+$(this).text()+'</option>';
//              });
//              x+="</select>";
//              $('#locationsSearch').html(x);
//	      }//end of else
//          }//success
//	});//end of ajax
//}//end make getLocationTypes
//-------------------------------------------------------------//---LOCATIONS--//---------------->>
//gets specifica table output for that location type
function getLocations(id) {
  $.ajax({
    type:'get',
    url:'proxy.php',
    data:{path:'/'+id+'/Locations'},
    dataType: 'xml',
    success: function(data){
      if( $(data).find('count').text() ==0){
        alert('THERE ARE NO LOCATIONS');
      }
      else{
        //add header 'Location Information'
        $('#resultsTitle').html('<h2>Location Information</h2>');
        var x = '<select id="locations">';
        $('location', data).each(
          function(){
            x+= '<option value="'+$(this).find('siteId').text()+'">'
	      + "Location: " + $(this).find('type').text() + '</option>';
	  });
        x+= '</select>';
	
	//create empty info div
	x+='<div id="information"></div>';
	$('#output').html(x);
	
	
	//returns the info for the last location in the list
	$('location', data).each(function(){
	  x='';
	  var id = $("#locations").val();
	  if( $(this).find('siteId').text() == id)
	  {
	  x+= '<table><tr>';
	  x+='<td>Type: </td><td>' + $(this).find('type').text() + '</td></tr>';
	  x+='<tr><td>Address: </td><td>'+ $(this).find('address1').text() +'</td></tr>';
	  x+='<tr><td>City: </td><td>'+$(this).find('city').text()+'</td></tr>';
	  x+='<tr><td>State: </td><td>'+$(this).find('state').text()+'</td></tr>';
	  x+='<tr><td>County: </td><td>'+$(this).find('countyName').text()+'</td></tr>';
	  x+='<tr><td>Zip: </td><td>'+$(this).find('zip').text()+'</td></tr>';
	  x+='<tr><td>Phone: </td><td>'+$(this).find('phone').text()+'</td></tr>';
	  x+='<tr><td>TTYPhone: </td><td>'+$(this).find('ttyphone').text()+'</td></tr>';
	  x+='<tr><td>Fax: </td><td>'+$(this).find('fax').text()+'</td></tr>';
	  x+='<tr><td>Latitude: </td><td>'+$(this).find('latitude').text()+'</td></tr>';
	  x+='<tr><td>Longitude: </td><td>'+$(this).find('longitude').text()+'</td></tr></table>';
	  x+='</div>';
	  $('#information').html(x);
	  }
	});
	
	//returns the info each time the list is changed
	$('#locations').change(function()
	{
	  var id = $(this).val();
	  console.log(id);
	  
	  $('location', data).each(function(){
	      if( $(this).find('siteId').text() == id)
	      {
		var y = '<table><tr>';
		y+='<td>Type: </td><td>' + $(this).find('type').text() + '</td></tr>';
		y+='<tr><td>Address: </td><td>'+ $(this).find('address1').text() +'</td></tr>';
		y+='<tr><td>City: </td><td>'+$(this).find('city').text()+'</td></tr>';
		y+='<tr><td>State: </td><td>'+$(this).find('state').text()+'</td></tr>';
		y+='<tr><td>County: </td><td>'+$(this).find('countyName').text()+'</td></tr>';
		y+='<tr><td>Zip: </td><td>'+$(this).find('zip').text()+'</td></tr>';
		y+='<tr><td>Phone: </td><td>'+$(this).find('phone').text()+'</td></tr>';
		y+='<tr><td>TTYPhone: </td><td>'+$(this).find('ttyphone').text()+'</td></tr>';
		y+='<tr><td>Fax: </td><td>'+$(this).find('fax').text()+'</td></tr>';
		y+='<tr><td>Latitude: </td><td>'+$(this).find('latitude').text()+'</td></tr>';
		y+='<tr><td>Longitude: </td><td>'+$(this).find('longitude').text()+'</td></tr></table>';
		$('#information').html(y);
	      }
	  });
	});//change function
	}//end of else
   }//success
 });
}//getLocations
//-------------------------------------------------------------//---TREATMENT--//---------------->>
function getTreatment(id)
{
  $.ajax({
    type:'get',
    url:'proxy.php',
    data:{path:'/'+id+'/Treatments'},
    dataType: 'xml',
    success: function(data){
      if($(data).find('error').length!=0){
        alert('error, mannnn');
      }
      else if($(data).find('count').text() == 0)
      {
        $('#output').html('<h3>No Treatmens Available...</h3>');
      }
      else{
	//add header 'Treatments'
        $('#resultsTitle').html('<h2>Treatments</h2>');
        var x ="<div><table id=\"myTable\" class=\"tablesorter\" border=\"0\" "+
                                        "cellpadding=\"0\" cellspacing=\"1\" ><thead><tr>" +
                                        "<th class=\"header\" >Type          <\/th>" +
                                        "<th class=\"header\" >Abbreviation<\/th>" +
                                        "<\/tr><\/thead>";
        
        $('treatment',data).each(
        function(){
          //make a table
           x+='<tr>';
          x+='<td>'+$(this).find('type').text()+'</td>';
          x+='<td>'+$(this).find('abbreviation').text()+'</td></tr>';
        });
        x+="</table>";
       $('#output').html(x);
      }//end of else
    }//success
  });
}//end getTreatment
//-------------------------------------------------------------//---TRAINING--//---------------->>
function getTraining(id) {
  $.ajax({
    type:'get',
    url:'proxy.php',
    data:{path:'/'+id+'/Training'},
    dataType: 'xml',
    success: function(data){
      if($(data).find('error').length!=0){
        alert('error, mannnn');
      }
      else if($(data).find('count').text() == 0)
      {
        $('#output').html('<h3>No Training Available...</h3>');
      }
      else{
         //add header 'Services/Training'
        $('#resultsTitle').html('<h2>Services/Training</h2>');
        var x ="<div><table id=\"myTable\" class=\"tablesorter\" border=\"0\" "+
                                        "cellpadding=\"0\" cellspacing=\"1\" ><thead><tr>" +
                                        "<th class=\"header\" >Type          <\/th>" +
                                        "<th class=\"header\" >Abbreviation<\/th>" +
                                        "<\/tr><\/thead>";
        
        $('training',data).each(
        function(){
          //make a table
           x+='<tr>';
          x+='<td>'+$(this).find('type').text()+'</td>';
          x+='<td>'+$(this).find('abbreviation').text()+'</td></tr>';
        });
        x+="</table>";
       $('#output').html(x);
      }//end of else
    }//success
  });
}//end getTraining
//-------------------------------------------------------------//---FACILITIES--//---------------->>
function getFacilities(id) {
$.ajax({
    type:'get',
    url:'proxy.php',
    data:{path:'/'+id+'/Facilities'},
    dataType: 'xml',
    success: function(data){
      if($(data).find('error').length!=0){
        alert('error, mannnn');
      }
      else if($(data).find('count').text() == 0)
      {
        $('#output').html('<h3>No Facilities Available...</h3>');
      }
      else{
        //add header 'Facilities'
        $('#resultsTitle').html('<h2>Facilities</h2>');
        var x ="<div><table id=\"myTable\" class=\"tablesorter\" border=\"0\" "+
                                        "cellpadding=\"2\" cellspacing=\"3\" ><thead><tr>" +
                                        "<th class=\"header\" >Name    <\/th>" +
                                        "<th class=\"header\" >         Quantity <\/th>" +
                                        "<th class=\"header\" >         Description  <\/th>" +
                                        "<\/tr><\/thead>";
        
        $('facility',data).each(
        function(){
          //make a table
           x+='<tr>';
          x+='<td>'+$(this).find('type').text()+'</td>';
          x+='<td>'+$(this).find('quantity').text()+'</td>';
          x+='<td>'+$(this).find('description').text()+'</td></tr>';
        });
        x+="</table>";
       $('#output').html(x);
      }//end of else
    }//success
  });
}
//-------------------------------------------------------------//---PHYSICIANS--//---------------->>
function getPhysicians(id) {
$.ajax({
    type:'get',
    url:'proxy.php',
    data:{path:'/'+id+'/Physicians'},
    dataType: 'xml',
    success: function(data){
      if($(data).find('error').length!=0){
        alert('error, mannnn');
      }
      else if($(data).find('count').text() == 0)
      {
        $('#output').html('<h3>No Physicians Available...</h3>');
      }
      else{
        //add header 'Physicians with Admitting Privilages'
        $('#resultsTitle').html('<h2>Physicians with Admitting Privilages</h2>');
        var x ="<div><table id=\"myTable\" class=\"tablesorter\" border=\"0\" "+
                                        "cellpadding=\"0\" cellspacing=\"1\" ><thead><tr>" +
                                        "<th class=\"header\" >Name          <\/th>" +
                                        "<th class=\"header\" >License          <\/th>" +
                                        "<th class=\"header\" >Contact<\/th>" +
                                        "<\/tr><\/thead>";
        
        $('physician',data).each(
        function(){
          //make a table
           x+='<tr>';
          x+='<td>'+$(this).find('fName').text() + ' ' + $(this).find('lName').text() + '</td>';
          x+='<td>'+$(this).find('license').text()+'</td>';
          x+='<td>'+$(this).find('phone').text()+'</td></tr>';
        });
        x+="</table>";
       $('#output').html(x);
      }//end of else
    }//success
  });
}//end getPhysicians
//-------------------------------------------------------------//---PEOPLE--//---------------->>
//gets people for specific  
function getPeople(id) {
$.ajax({
    type:'get',
    url:'proxy.php',
    data:{path:'/'+id+'/People'},
    dataType: 'xml',
    success: function(data){
      if( $(data).find('siteCount').text() ==0){
        alert('THERE ARE NO PEOPLE');
      }
      else{
        //add header 'People'
        $('#resultsTitle').html('<h2>People</h2><h4>Please choose a Site: </h4>');
        var x = '<select id="sites">';
        $('site', data).each(
          function(){
            x+= '<option value="'+$(this).attr('address')+'">'
	      + $(this).attr('address') + '</option>';
	  });
        x+= '</select>';
	
	//create empty info div
	x+='<div id="information"></div>';
	$('#output').html(x);
	
	//returns the info for the first site in the list
	var address = $("#sites").val();
	console.log( $("#sites").val() );
	$('site', data).each(function(){
	  x='';
	  if( $(this).attr('address') == address)
	  {
	  x+= '<table><tr>'+ "Site: " + $(this).attr('siteId') + "   :   "  + $(this).attr('address') +'</tr>';
	  x+='<tr><td> Name       </td><td> Role         </td></tr>';
	  //FOR EACH PERSON
	  $(this).find('person').each(function(){
	    //alert('person to be added');
	    x+='<tr><td>'+ $(this).find('lName').text() +'</td><td>' + $(this).find('role').text() + '</td></tr>'; 
	  });
	  x+='</table>';
	  x+='</div>';
	  $('#information').html(x);
	  }//end of if
	});
	
	//returns the info each time the list is changed
	$('#sites').change(function()
	{
	  var address = $(this).val();
	  console.log(address);
	  $('site', data).each(function(){
	    if( $(this).attr('address') == address)
	    {
	      var y = '<table><tr>'+ "Site: " + $(this).attr('siteId') + " : " + $(this).attr('address') +'</tr>';
	      y+='<tr><td> Name </td><td> Role </td></tr>';
	      //IF Person Count = 0
	      if($(this).find('personCount').text() == 0)
	      {
		$('#information').html('<h2>No People Available...</h2>');
	      }
	      //else just regularly search for people
	      else{
		$(this).find('person').each(function(){
		  //alert('person to be added');
		  y+='<tr><td>'+ $(this).find('lName').text() +'</td><td>' + $(this).find('role').text() + '</td></tr>'; 
		});
		y+='</table>';
		$('#information').html(y);
	      }//end of else
	}//end of if
	  });
	});//change function
      }//end of else
    }//success
  });
}//getPeople
//-----------------------------------//GET CITIES--//-----------------------
function getCities(which){
  if (which=='') {
  $('#orgCitySearch').html("City/Town<input id=\"cityTown\" type=\"text\" />");				
  } else {
    $.ajax ({
      type: 'GET',
      async: true,
      cache: false,
      url: 'proxy.php',
      data: {path: "/Cities?state="+which},
      dataType: 'xml',
      success: function(data,status) {
              var x='';
              if ($(data).find('error').length != 0) {
                      //have an error what do you want to do????
              }
              else if ($(data).find('row').length==0 && which != '') {
              $('#orgCitySearch').html("City/Town<input id=\"cityTown\" type=\"text\" "+
              "value=\"No cities/towns in "+which+"\" />");
	      }//end of else if
              else {
              x += "<select id=\"cityTown\" name=\"town\"><option value=\"\">"+
                  "--cities--<\/option>";
              $('row',data).each(
                function() {
                  x+='<option value="'+$(this).find('city').text()+'">'+
                          $(this).find('city').text()+'<\/option>';
                }
                );
              x+="<\/select>";
              $('#orgCitySearch').html(x);
	      }//end of else
          }//success
	});//end of ajax
    }//end of else
}//end of GetCities

//-----------------------------------//CHECK SEARCH--//-----------------------		
function checkSearch() {
  console.log($('#Form1').serialize());
    $.ajax( {
      type:'GET',
      async:true,
      cache:false,
      url: "proxy.php",
      data: {path: "/Organizations?"+$('#Form1').serialize()},
      dataType: 'xml',
      success: function(data,status) {
        var x='';
        $('#output').html('');
          if ($(data).find('error').length !=0) {
            $('error',data).each(
              function() {
              x+=" error getting data";
              }
            );
          }
          else if ($(data).find('row').length==0) {
          x+="No data matches for: "+$('#orgType').val() +
          (($('#orgName').val()!='') ? " > name: "+$('#orgName').val() : " ") +
          (($('#state').val()!='') ? " > state: "+$('#state').val() : " ");

            if ($('#cityTown').val()=='' || $('#cityTown').val().search(/No cities/)==0) {
              x+= "";
            }
            else {
              x+= " > City: "+$('#cityTown').value();
            }td
	  } else if ($('#orgType').val() == 'Physician') {
            //build a result for physicians with links to get a specific one
            //----------------------------------------------------------------------PHYSICIAN GET
            //do same for other orgTypes?
            $('#resultsTitle').html('<h2> ( '+$(data).find('row').length+ ' total found) </h2>');
            x+="<div><table id=\"myTable\" class=\"tablesorter\" border=\"0\" "+
            "cellpadding=\"0\" cellspacing=\"1\" ><thead><tr>" +
            "<th class=\"header\" >First Name<\/th>" +
            "<th class=\"header\" >Middle Name<\/th>" +
            "<th class=\"header\" >Last Name<\/th>" +
            "<th class=\"header\">Name<\/th> "+
            "<th class=\"header\" >City<\/th>" +
            "<th class=\"header\">Zip<\/th> " +
            "<th class=\"header\" style=\"width:70px;\">County<\/th> "+
            "<th class=\"header\" style=\"width:40px;\">State<\/th>" +
            "<\/tr><\/thead>";
            $('row',data).each(
              function() {
                x+="<tr>";
  
                x+="<td>"+$(this).find('fName').text() + "</td>";
                x+="<td>"+$(this).find('mName').text() + "</td>";
                x+="<td>"+$(this).find('lName').text() + "</td>";
                x+="<td style=\"cursor:pointer;color:#987;\" onclick=\"getTabs("+
                $(this).find('OrganizationID').text()+");\">"+$(this).find('Name').text()+"<\/td>";
                x+= "<td>"+$(this).find('city').text()+"<\/td>";
                x+= "<td>"+$(this).find('zip').text()+"<\/td>";
                x+= "<td>"+$(this).find('CountyName').text()+"<\/td>";
                x+= "<td>"+$(this).find('State').text()+"<\/td><\/tr>";
              }//end of function
            );
            x+="<\/table>";
	    }
            else {
              $('#resultsTitle').html('<h2>Results ( '+$(data).find('row').length+ ' total found) </h2>');
              x+="<div><table id=\"myTable\" class=\"tablesorter\" border=\"0\" "+
              "cellpadding=\"0\" cellspacing=\"1\" ><thead><tr><th class=\"header\" "+
              "style=\"width:90px;\">Type<\/th><th class=\"header\">Name<\/th> "+
              "<th class=\"header\" >City<\/th><th class=\"header\">Zip<\/th> " +
              "<th class=\"header\" style=\"width:70px;\">County<\/th> "+
              "<th class=\"header\" style=\"width:40px;\">State<\/th><\/tr><\/thead>";
              $('row',data).each(
                function() {
                  x+='<tr>';
                  x+='<td>'+$(this).find('type').text()+'<\/td>';
                  x+="<td style=\"cursor:pointer;color:#987;\" onclick=\"getTabs("+
                  $(this).find('OrganizationID').text()+");\">"+$(this).find('Name').text()+"<\/td>";
    ////-----Magnificent Popup
    //x+='<td><a class="simple-ajax-popup-align-top" href="index.html" onclick="getTabs('+$(this).find('OrganizationID').text()+'); return false;">'+$(this).find('Name').text()+'</a></td>';
    ////----END Magnificent Popup
                  x+= "<td>"+$(this).find('city').text()+"<\/td>";
                  x+= "<td>"+$(this).find('zip').text()+"<\/td>";
                  x+= "<td>"+$(this).find('CountyName').text()+"<\/td>";
                  x+= "<td>"+$(this).find('State').text()+"<\/td><\/tr>";
                }//end of function
                );
		x+="<\/table>";
	      }//end of else
	      $('#output').html(x);
	      
	      //Magnificent Pop up
	      $('.simple-ajax-popup-align-top').magnificPopup({
		type: 'ajax',
		alignTop: true,
		// callbacks: {
		//	 parseAjax: function(jqXHR) {
		//		 jqXHR.responseText = $('<div>HELLO</div>');
		//	 }
		// },
		overflowY: 'scroll' // as we know that popup content is tall we set scroll overflow by default to avoid jump
		});
	      //END Magnificent Pop Up
	      
      } //end success
    });//end ajax
}//end of function
