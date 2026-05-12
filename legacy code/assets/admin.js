jQuery(function($){
  $(document).on('blur','.ifam-inline-title', function(){
    var fid=$(this).data('fid'), title=$(this).text().trim();
    if(!title){ alert('Title cannot be empty'); return;}
    $.post(IFAM_ADMIN.ajax,{ action:'ifam_update_title', fid:fid, title:title, _wpnonce:IFAM_ADMIN.nonce },function(resp){
      if(!(resp&&resp.success)) alert('Failed to save title');
    },'json');
  });
  $(document).on('click','.ifam-dup', function(e){
    e.preventDefault();
    $.post(IFAM_ADMIN.ajax,{ action:'ifam_duplicate_form', fid:$(this).data('fid'), _wpnonce:IFAM_ADMIN.nonce },function(resp){
      if(resp&&resp.success) location.reload(); else alert('Duplicate failed');
    },'json');
  });
  $(document).on('click','.ifam-delete-form', function(e){
    e.preventDefault();
    if(!confirm('Delete this form?')) return;
    $.post(IFAM_ADMIN.ajax,{ action:'ifam_delete_form', fid:$(this).data('fid'), _wpnonce:IFAM_ADMIN.nonce },function(resp){
      if(resp&&resp.success) location.reload(); else alert('Delete failed');
    },'json');
  });
});