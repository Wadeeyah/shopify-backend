jQuery(function($){
  var deliverySaved = false;

  function toast(msg){
    var $t = $('#ifam-toast');
    if(!$t.length){ return; }
    $t.text(msg||'Saved successfully!!').show();
    setTimeout(function(){ $t.hide(); }, 2200);
  }
  function clearFeedback(){ $('#ifam-response').empty(); $('#ifam-toast').hide().text(''); }
  $(document).on('input change', '.ifam-form :input', clearFeedback);
  $(document).on('click', '.ifam-tab, .ifam-next, .ifam-prev', clearFeedback);

  function shakeForm(){ var $f=$('.ifam-form'); $f.addClass('ifam-shake'); setTimeout(()=>{$f.removeClass('ifam-shake')},600); }
  function markError($el){ $el.addClass('ifam-error'); }
  function clearErrors(){ $('.ifam-input').removeClass('ifam-error'); }
  function success(msg){ $('#ifam-response').html('<em style="font-style:italic;color:green;">'+(msg||'Saved successfully!!')+'</em>'); toast(msg); }
  function fail(msg){ $('#ifam-response').html('<em style="color:red;">'+(msg||'Please complete all required fields.')+'</em>'); }

  $('.ifam-tab').on('click', function(){
    var target = $(this).data('tab');
    if($('#ifam-del').is(':visible') && target!=='ifam-del' && !deliverySaved){ clearDeliveryFields(); }
    $('.ifam-tab').removeClass('ifam-active'); $(this).addClass('ifam-active');
    $('.ifam-panel').hide(); $('#'+target).show();
  });

  $('.ifam-next').on('click', function(e){
    var next = $(this).data('next');
    // When moving to Delivery Method, ensure Credentials are valid and shake on error
    if (next === 'ifam-del') {
      if (!validateCredentials(true)) {
        e.preventDefault();
        fail('Please complete required fields in Credentials.');
        shakeForm();
        return;
      }
    }
    $('.ifam-tab[data-tab="'+next+'"]').click();
  });
  $('.ifam-prev').on('click', function(){
    if ($(this).data('prev') === 'ifam-cred') {
      if (!validateCredentials(true)) { fail('Please complete required fields in Credentials.'); shakeForm(); }
    }
    $('.ifam-tab[data-tab="'+$(this).data('prev')+'"]').click();
  });

  function showDel(t){
    var $wrap=$('.ifam-delivery'); $wrap.addClass('swapping'); setTimeout(()=>{$wrap.removeClass('swapping')},220);
    var $c=$('#ifam-del-fields'); $c.find('.ifam-del-field').removeClass('show');
    if(t==='email')    $c.find('.ifam-del-field[data-type="email"]').addClass('show');
    if(t==='whatsapp') $c.find('.ifam-del-field[data-type="whatsapp"]').addClass('show');
    if(t==='slack')    $c.find('.ifam-del-field[data-type="slack"]').addClass('show');
  }
  $(document).on('change','input[name=delivery_method]',function(){
    var val = $(this).val();
    showDel(val);

    // For Slack or Email only preset, ensure only one value is stored
    var preset = $('.ifam-save-all').data('preset') || 'all';
    if (preset === 'slack_email' || preset === 'email_slack_single') {
      if (val === 'email') {
        $('[name=delivery_slack]').val('');
      } else if (val === 'slack') {
        $('[name=delivery_email]').val('');
      }
    }
  });

  function enforceDayLimit(p){
    var limit=0;
    if(p==='slack_email' || p==='email') limit=1;
    if(p==='slack_whatsapp')             limit=3;
    var $days=$('#ifam-days input[type=checkbox]');
    $days.off('change').on('change',function(){
      if(limit===0) return;
      var $all=$('#ifam-days input[type=checkbox]');
      var checked = $all.filter(':checked');
      if(limit===1 && checked.length>1){
        $all.not(this).prop('checked',false);
        alert('Plan limit: only 1 day allowed for this delivery preset.');
      } else if(limit>1 && checked.length>limit){
        $(this).prop('checked',false);
        alert('Limit reached: you can select up to '+limit+' day(s) for this delivery preset.');
      }
    });
  }
  enforceDayLimit($('.ifam-save-all').data('preset')||'all');

  var waRe=/^\+\d[\d\s\-()]{6,}$/;
  function validateWhatsAppOnTheFly(){
    var $wa=$('[name=delivery_whatsapp_number]'), val=$wa.val().trim();
    var method=$('input[name=delivery_method]:checked').val();
    if((method==='whatsapp' && !waRe.test(val)) || (val!=='' && !waRe.test(val))){
      $wa.addClass('ifam-error');
      fail('Please include a valid country code for WhatsApp (e.g., +1 555 123 4567).');
      return false;
    } else { $wa.removeClass('ifam-error'); return true; }
  }
  $(document).on('input blur','[name=delivery_whatsapp_number]', validateWhatsAppOnTheFly);
  $(document).on('change','input[name=delivery_method]', validateWhatsAppOnTheFly);

  function clearDeliveryFields(){
    var $f=$('.ifam-form');
    $f.find('[name=delivery_email]').val('');
    $f.find('[name=delivery_whatsapp_number]').val('');
    $f.find('[name=delivery_slack]').val('');
    $f.find('input[name=delivery_method]').prop('checked',false);
    $f.find('input[name="delivery_days[]"]').prop('checked',false);
    $f.find('[name=delivery_time]').prop('selectedIndex',0);
    $('#ifam-del-fields .ifam-del-field').removeClass('show');
  }

  function validateCredentials(highlight){
    var $f=$('.ifam-form'), missing=[];
    var $dom=$f.find('[name=shopify_domain]'),
        $tok=$f.find('[name=shopify_token]'),
        $ads=$f.find('[name=ads_platform]'),
        $api=$f.find('[name=ads_api]');
    if(!$dom.val().trim()) missing.push($dom);
    if(!$tok.val().trim()) missing.push($tok);

    var adsOn = $('#ifm-ads-toggle').is(':checked');
    if(adsOn){
      if(!$ads.val().trim()) missing.push($ads);
      if(!$api.val().trim()) missing.push($api);
    }

    if(highlight && missing.length){ clearErrors(); missing.forEach(markError); }
    return missing.length===0;
  }

  function validateDelivery(highlight){
    var $f=$('.ifam-form'), missing=[];
    var method=$('input[name=delivery_method]:checked').val();
    var days = $f.find('input[name="delivery_days[]"]:checked');
    var time = $f.find('[name=delivery_time]').val();

    if(!method){ missing.push($('input[name=delivery_method]').first().closest('.ifam-delivery')); }
    if(days.length===0){ missing.push($('#ifam-days')); }
    if(!time){ missing.push($('[name=delivery_time]')); }

    if(method==='email' && !$f.find('[name=delivery_email]').val().trim()) missing.push($('[name=delivery_email]'));
    if(method==='slack' && !$f.find('[name=delivery_slack]').val().trim()) missing.push($('[name=delivery_slack]'));
    if(method==='whatsapp'){
      var $wa=$('[name=delivery_whatsapp_number]');
      if(!$wa.val().trim() || !/^\+\d[\d\s\-()]{6,}$/.test($wa.val().trim())) missing.push($wa);
    }

    if(highlight && missing.length){
      clearErrors();
      missing.forEach(function($el){
        if($el.attr && $el.attr('type')==='checkbox'){ $('#ifam-days .ifam-day input').addClass('ifam-error'); }
        else if($el.find && $el.find('input').length){ $el.find('input').addClass('ifam-error'); }
        else { $el.addClass('ifam-error'); }
      });
    }
    return missing.length===0;
  }

  function saveAll(){
    clearErrors();
    var okCred = validateCredentials(true);
    var okDel  = validateDelivery(true);
    if(!(okCred && okDel)){
      shakeForm();
      fail('Please complete all required fields.');
      return;
    }

    var $f=$('.ifam-form'), fid=$f.find('[name=form_id]').val();
    var preset = $('.ifam-save-all').data('preset') || 'all';

    var payload={ section:'delivery', form_id:fid,
      shopify_domain: $f.find('[name=shopify_domain]').val(),
      shopify_token:  $f.find('[name=shopify_token]').val(),
      ads_platform:   $f.find('[name=ads_platform]').val(),
      ads_api:        $f.find('[name=ads_api]').val(),
      delivery_method:$('input[name=delivery_method]:checked').val(),
      delivery_days:  [],
      delivery_time:  $f.find('[name=delivery_time]').val()
    };

    // Collect selected days
    $f.find('input[name="delivery_days[]"]:checked').each(function(){ payload.delivery_days.push($(this).value || $(this).val()); });

    // Attach delivery channels based on preset so all relevant fields are sent
    var emailVal = $f.find('[name=delivery_email]').val();
    var slackVal = $f.find('[name=delivery_slack]').val();
    var waVal    = ($f.find('[name=delivery_whatsapp_number]').val() || '').trim();

    if (preset === 'all') {
      if (emailVal) payload.delivery_email = emailVal;
      if (slackVal) payload.delivery_slack = slackVal;
      if (waVal)    payload.delivery_whatsapp = waVal;
      payload.delivery_preset = 'all';
    } else if (preset === 'slack_whatsapp') {
      if (slackVal) payload.delivery_slack = slackVal;
      if (waVal)    payload.delivery_whatsapp = waVal;
      payload.delivery_preset = '2';
    } else if (preset === 'slack_email' || preset === 'email_slack_single') {
      if (payload.delivery_method === 'email' && emailVal) {
        payload.delivery_email = emailVal;
      } else if (payload.delivery_method === 'slack' && slackVal) {
        payload.delivery_slack = slackVal;
      }
      payload.delivery_preset = '1';
    } else {
      // Fallback: behave like original single-channel logic
      if(payload.delivery_method === 'email' && emailVal)    payload.delivery_email   = emailVal;
      if(payload.delivery_method === 'slack' && slackVal)    payload.delivery_slack   = slackVal;
      if(payload.delivery_method === 'whatsapp' && waVal)    payload.delivery_whatsapp= waVal;
      payload.delivery_preset = preset;
    }

    deliverySaved = true;
    success('Saved successfully!!');

    $.post(IFAM_CFG.ajax,{
      action:'ifam_save_frontend', nonce:IFAM_CFG.nonce, payload:JSON.stringify(payload)
    }, function(resp){
      if(!(resp && resp.success)){
        fail('Save failed.');
      }
    }, 'json');
  }

  $(document).on('click','.ifam-save-all', saveAll);

  // ==== Right-aligned Ads Toggle (default OFF) ====
  function buildToggle(id){
    return $('<label class="switch">'+
      '<input id="'+id+'" type="checkbox">'+
      '<span class="slider">'+
      '  <span class="circle">'+
      '    <svg class="cross" viewBox="0 0 365.696 365.696"><path d="M243.187,182.848L356.99,69.045c11.587-11.581,11.587-30.376,0-41.957c-11.581-11.581-30.376-11.581-41.957,0L201.23,140.891L87.427,27.088c-11.581-11.581-30.376-11.581-41.957,0c-11.581,11.581-11.581,30.376,0,41.957l113.803,113.803L45.47,296.651c-11.581,11.581-11.581,30.376,0,41.957c5.79,5.79,13.388,8.686,20.979,8.686s15.189-2.896,20.979-8.686l113.803-113.803l113.803,113.803c5.79,5.79,13.388,8.686,20.979,8.686s15.189-2.896,20.979-8.686c11.587-11.581,11.587-30.376,0-41.957L243.187,182.848z"/></svg>'+
      '    <svg class="checkmark" viewBox="0 0 24 24"><path d="M20.285,2.859l-11.4,11.4l-5.2-5.2l-2.8,2.8l8,8l14.2-14.2L20.285,2.859z"/></svg>'+
      '  </span>'+
      '</span>'+
    '</label>');
  }
  function mountAdsToggle(){
    var $label = $('label:contains("Ads Platform")').filter(':visible').first();
    if(!$label.length){ return; }
    var $platform = $label.find('select[name="ads_platform"]');
    if(!$platform.length){ $platform = $label.nextAll('select').first(); }
    var $api = $('input[name="ads_api"], input[name="ads_api_token"]').first();
    if(!$platform.length || !$api.length){ return; }
    if($label.find('.ifm-toggle-wrap').length){ return; }

    var $wrap = $('<span class="ifm-toggle-wrap ifm-toggle-right" title="Toggle Ads fields on/off"></span>');
    var $txt  = $('<span class="ifm-toggle-label">Enable Ads</span>');
    var $tgl  = buildToggle('ifm-ads-toggle');

    $label.append($wrap);
    $wrap.append($txt).append($tgl);

    function apply(on){
      if(on){
        $platform.prop('disabled', false).css('opacity', 1);
        $api.prop('disabled', false).css('opacity', 1);
        $txt.text('Enable Ads');
      } else {
        $platform.prop('disabled', true).val('');
        $api.prop('disabled', true).val('');
        $platform.css('opacity', .55);
        $api.css('opacity', .55);
        $txt.text('Enable Ads');
      }
    }
    apply(false); // default OFF
    var $chk = $tgl.find('input');
    $chk.prop('checked', false);
    $chk.on('change', function(){ apply(this.checked); });
  }
  try{ mountAdsToggle(); }catch(e){}
  var obs = new MutationObserver(function(){ try{ mountAdsToggle(); }catch(e){} });
  obs.observe(document.body, { childList:true, subtree:true });

// Data Management
  $(document).on('click','.ifam-delete', function(){
    var $inp = $('#ifam-delete-confirm');
    var typed = ($inp.val()||'').trim().toLowerCase();
    var $resp = $('.ifam-delete-response');
    $resp.attr('role','status').attr('aria-live','polite');

    if (typed !== 'delete data') {
      $inp.addClass('ifam-error').focus();
      $resp.html('<span style="color:#dc2626;">Type <strong>delete data</strong> exactly to proceed.</span>');
      return;
    } else {
      $inp.removeClass('ifam-error');
      $resp.empty();
    }

    var reason = window.prompt('Please enter a brief reason for deleting your data:');
    if (!reason || !reason.trim()) {
      $resp.html('<span style="color:#dc2626;">Deletion cancelled. A reason is required.</span>');
      return;
    }

    var $f=$('.ifam-form'), fid=$f.find('[name=form_id]').val();
    $.post(IFAM_CFG.ajax, {
      action:'ifam_delete_data', nonce:IFAM_CFG.nonce, reason:reason.trim(), form_id:fid
    }, function(resp){
      if(resp && resp.success){
        $resp.html('<span style="color:#16a34a;">'+(resp.data && resp.data.message ? resp.data.message : 'Data deleted')+'</span>');
        // Optional: clear visible fields for clarity
        $f.find('[name=shopify_domain],[name=shopify_token],[name=ads_api]').val('');
        $f.find('[name=ads_platform]').val('');
        $f.find('[name=delivery_email],[name=delivery_whatsapp_number],[name=delivery_slack]').val('');
        $f.find('input[name="delivery_days[]"]').prop('checked',false);
      } else {
        $resp.html('<span style="color:#dc2626;">Delete failed. Please try again.</span>');
      }
    }, 'json');
  });

});