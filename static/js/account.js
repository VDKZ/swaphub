
// ADD LINK

$(document).on('click','#add_link',function(){
	$('.add_link_name').val('');
	$('.add_link_url').val('');
	$('#addLinkModal').modal('show');
})

$(document).on('click','#btn_add_link',function(){
	var name = 	$('.add_link_name').val();
	var url = $('.add_link_url').val();
	var count = parseInt($('.table_tr').length) + 1;
	var number = parseInt($('#card_body').data('number'));

	$.ajax({
		type: "POST",
		url: ('addLink'),
		dataType: 'json',
		data: {
		  'name': name,
		  'url': url
		},
		success: function (data) {
			$('#link_table').append('\
		  		<tr id="account_links" class="table_tr" data-id="'+data+'">\
		  			<td class="td_name">'+name+'</td>\
		  			<td class="td_url">'+url+'</td>\
		  			<td><input data-id="'+data+'" class="link_active" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" type="checkbox"></td>\
		  			<td>0</td>\
		  			<td>0</td>\
		  			<td class="td_btn">\
		  				<a data-id="'+data+'" data-url="'+url+'" class="btn btn-outline-primary view_link"><i class="fa fa-eye"></i></a>\
		  				<a data-id="'+data+'" data-name="'+name+'" data-url="'+url+'" class="btn btn-outline-primary edit_link"><i class="fa fa-pencil"></i></a>\
		  				<a data-id="'+data+'" class="btn btn-outline-primary delete_link"><i class="fa fa-trash"></i></a>\
		  			</td>\
		  		</tr>\
			')
			if(count >= number){
				$('#add_link').css('display','none');
			}
			$('.link_active[data-id="'+data+'"]').bootstrapToggle();
			$('#addLinkModal').modal('hide');
		}
	});	
	
})

// VIEW LINK

$(document).on('click','.view_link',function(){
	var src = $(this).data('url');
    $('#iframe_class_view').attr('src',src);
  
	$('#viewLinkModal').modal('show')
})

// EDIT LINK

$(document).on('click','.edit_link',function(){
	var id = $(this).data('id');
	var name = $(this).data('name');
	var url = $(this).data('url');
	$('.edit_link_name').val(name);
	$('.edit_link_url').val(url);
	$('#btn_edit_link').data('id',id)
	$('#editLinkModal').modal('show');
})

$(document).on('click','#btn_edit_link',function(){
	var linkId = $(this).data('id');
	var name = 	$('.edit_link_name').val();
	var url = $('.edit_link_url').val();

	$.ajax({
		type: "POST",
		url: ('editLink'),
		dataType: 'json',
		data: {
		  'linkId': linkId,
		  'name': name,
		  'url': url
		},
		success: function (data) {
			$('.table_tr[data-id="'+linkId+'"]').children('.td_name').html(name);
			$('.table_tr[data-id="'+linkId+'"]').children('.td_url').html(url);
			$('.table_tr[data-id="'+linkId+'"]').children('.td_btn').children('.edit_link').data('url',url);
			$('.table_tr[data-id="'+linkId+'"]').children('.td_btn').children('.edit_link').data('name',name);
			$('.table_tr[data-id="'+linkId+'"]').children('.td_btn').children('.view_link').data('url',url);
			$('#editLinkModal').modal('hide');
		}
	});	
})

// DELETE LINK

$(document).on('click','.delete_link',function(){
	var linkId = $(this).data('id');
	var count = parseInt($('.table_tr').length);
	var number = parseInt($('#card_body').data('number'));

    $.alert({
        title: 'Delete website link',
        theme: 'material',
        content: 'Are you sure you want to delete ?',
        type: 'red',
        buttons: {
	        delete: function () {
	    		$.ajax({
					type: "POST",
					url: ('deleteLink'),
					dataType: 'json',
					data: {
					  'linkId': linkId
					},
					success: function (data) {
						if(count <= number){
							$('#add_link').css('display','block');
						}
						$('.table_tr[data-id="'+linkId+'"]').remove();
					}
				});	
	        },
	        cancel: function () {

	        }
    	}
    });
})

// ACTIVE LINK

$(document).on('change','.link_active',function(){

	var linkId = $(this).data('id');
	var active = $(this).prop('checked');

	$.ajax({
		type: "POST",
		url: ('activeLink'),
		dataType: 'json',
		data: {
		  'linkId': linkId,
		  'active': active
		}
	});
})

// USER MAX VISITS

$(document).on('click','#btn_max_visits',function(){
	var value = $('#user_max_visits').val();

	$.ajax({
		type: "POST",
		url: ('setUserMaxVisits'),
		dataType: 'json',
		data: {
		  'value': value
		},
		success: function (data) {
		    $.alert({
		        title: 'Congratulations !',
		        theme: 'material',
		        content: 'You have set your daily limits',
		        type: 'green'
		    });
		}
	});
})

// DELETE ACCOUNT

$(document).on('click','#delete_account',function(){
    $.alert({
        title: 'Account delete',
        theme: 'material',
        content: 'Are you sure you want to delete your account ?',
        type: 'red',
        buttons: {
	        yes: function () {
	    		$.ajax({
					type: "POST",
					url: ('deleteAccount'),
					dataType: 'json',
					success: function (data) {
						window.location.reload();
					}
				});	
	        },
	        no: function () {

	        }
    	}
    });
})
