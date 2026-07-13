<?php
/*
Plugin Name: InsightFlow Automation Manager
Description: Public-facing form (no login required). Preset↔day limits sync, secure encryption, smooth transitions, and WhatsApp country-code validation.
Version: 7.6.8
Author: InsightFlow
Text Domain: insightflow-automation-manager
*/
if (!defined('ABSPATH')) exit;

final class IFAM_V6 {
    const OPT_FORMS  = 'ifam_forms_v6';
    const OPT_GLOBAL = 'ifam_global_v6';
    const LOG_TABLE  = 'ifam_deletion_logs_v6';

    public function __construct() {
        add_action('init', [$this,'init_defaults']);
        add_action('admin_menu', [$this,'admin_menu']);
        add_shortcode('saas_credentials_form', [$this,'shortcode_render']);

        add_action('wp_enqueue_scripts',  [$this,'enqueue_frontend']);
        add_action('admin_enqueue_scripts',[$this,'enqueue_admin']);

        add_action('wp_ajax_ifam_save_frontend',       [$this,'ajax_save_frontend']);
        // Public (nopriv) save disabled: submissions require login
        add_action('wp_ajax_ifam_delete_data',         [$this,'ajax_delete_data']);
        // Public (nopriv) delete disabled: requires login
        add_action('wp_ajax_ifam_update_title',   [$this,'ajax_update_title']);
        add_action('wp_ajax_ifam_delete_form',    [$this,'ajax_delete_form']);
        add_action('wp_ajax_ifam_duplicate_form', [$this,'ajax_duplicate_form']);
        add_action('wp_ajax_ifam_admin_generate_jwt', [$this,'ajax_admin_generate_jwt']);

        add_action('admin_post_ifam_save_form',   [$this,'handle_admin_save_form']);
        add_action('rest_api_init', [$this,'register_rest_routes']);

        register_activation_hook(__FILE__, [$this,'on_activate']);
        register_uninstall_hook(__FILE__, ['IFAM_V6','on_uninstall']);
    }

    public function init_defaults(){
        if (get_option(self::OPT_FORMS) === false) {
            $default = [
                'form_1'=>[
                    'id'      =>'form_1',
                    'title'   =>'Default Credentials Form',
                    'author'  =>'admin',
                    'date'    =>date('c'),
                    'delivery_preset' =>'all',
                    'delivery_options'=>['email','whatsapp','slack'],
                    'schedules'=>['Monday','Tuesday','Wednesday','Thursday','Friday'],
                    'times'    =>['09:00','12:00','15:00'],
                    'webhook'  =>'',
                    'verify_webhook' => ''
                ]
            ];
            add_option(self::OPT_FORMS, $default);
        }
    }

    public function on_activate(){
        global $wpdb;
        $table = $wpdb->prefix . self::LOG_TABLE;
        $charset = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE IF NOT EXISTS {$table} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id BIGINT(20) UNSIGNED NULL,
            reason TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id)
        ) {$charset};";
        require_once(ABSPATH.'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    public static function on_uninstall(){}

    private function encrypt_secret($txt){
        if (!$txt) return '';
        $key = hash('sha256', AUTH_KEY);
        $iv  = substr(hash('sha256', SECURE_AUTH_KEY), 0, 16);
        $enc = openssl_encrypt($txt,'AES-256-CBC',$key,0,$iv);
        return $enc ? base64_encode($enc) : '';
    }
    private function decrypt_secret($enc){
        if (!$enc) return '';
        $key = hash('sha256', AUTH_KEY);
        $iv  = substr(hash('sha256', SECURE_AUTH_KEY), 0, 16);
        $dec = base64_decode($enc);
        return $dec ? openssl_decrypt($dec,'AES-256-CBC',$key,0,$iv) : '';
    }
    private function jwt_encode(array $payload, string $secret, int $exp=300){
        $hdr = ['alg'=>'HS256','typ'=>'JWT'];
        $payload['iat'] = time();
        $payload['exp'] = time() + $exp;
        $b64 = function($d){ return rtrim(strtr(base64_encode($d), '+/', '-_'), '='); };
 

function ifam_jwt_decode_verify($jwt, $secret){
  if (empty($jwt) || empty($secret) || !is_string($jwt)) return false;
  $parts = explode('.', $jwt);
  if (count($parts) !== 3) return false;
  [$h64,$p64,$s64] = $parts;

  $b64url_decode = function($str){
    $str = strtr($str, '-_', '+/');
    $pad = strlen($str) % 4;
    if ($pad) $str .= str_repeat('=', 4 - $pad);
    $raw = base64_decode($str, true);
    return $raw === false ? false : $raw;
  };

  $hdr_json = $b64url_decode($h64);
  $pl_json  = $b64url_decode($p64);
  if ($hdr_json === false || $pl_json === false) return false;

  $hdr = json_decode($hdr_json, true);
  $pl  = json_decode($pl_json, true);
  if (!is_array($hdr) || !is_array($pl)) return false;

  // Only support HS256
  if (($hdr['alg'] ?? '') !== 'HS256') return false;

  $sig_raw = $b64url_decode($s64);
  if ($sig_raw === false) return false;

  $data = $h64 . '.' . $p64;
  $calc = hash_hmac('sha256', $data, $secret, true);
  if (!hash_equals($calc, $sig_raw)) return false;

  // Exp check (if provided)
  if (isset($pl['exp']) && is_numeric($pl['exp']) && time() > intval($pl['exp'])) return false;

  return $pl;
}

       $h = $b64(json_encode($hdr));
        $p = $b64(json_encode($payload));
        $sig = hash_hmac('sha256', "$h.$p", $secret, true);
        $s = $b64($sig);
        return "$h.$p.$s";
    }

    public function enqueue_frontend(){
        wp_enqueue_style('ifam-front', plugin_dir_url(__FILE__).'assets/style.css', [], null);
        wp_enqueue_script('ifam-front', plugin_dir_url(__FILE__).'assets/script.js', ['jquery'], null, true);
        wp_localize_script('ifam-front','IFAM_CFG',[
            'ajax'=>admin_url('admin-ajax.php'),
            'nonce'=>wp_create_nonce('ifam_front'),
        ]);
    }
    public function enqueue_admin($hook){
        wp_enqueue_style('ifam-admin', plugin_dir_url(__FILE__).'assets/admin.css', [], null);
        wp_enqueue_script('ifam-admin', plugin_dir_url(__FILE__).'assets/admin.js', ['jquery'], null, true);
        wp_localize_script('ifam-admin','IFAM_ADMIN',[
            'ajax'=>admin_url('admin-ajax.php'),
            'nonce'=>wp_create_nonce('ifam_admin'),
            'editor_url'=>admin_url('admin.php?page=ifam-editor')
        ]);
    }

    public function shortcode_render($atts){
        $atts = shortcode_atts(['id'=>'form_1'],$atts,'saas_credentials_form');
        $forms = get_option(self::OPT_FORMS, []);
        $fid = sanitize_text_field($atts['id']);
        if (!isset($forms[$fid])) return '<p>Form not found.</p>';

        $uid = get_current_user_id(); if (!$uid) { $uid = 0; }

        $f   = $forms[$fid];
        $has_email    = in_array('email',    (array)$f['delivery_options'], true);
        $has_whatsapp = in_array('whatsapp', (array)$f['delivery_options'], true);
        $has_slack    = in_array('slack',    (array)$f['delivery_options'], true);
        $times        = (array)($f['times'] ?? []);
        $preset       = $f['delivery_preset'] ?? 'all';

        ob_start(); ?>
        <div class="ifam-wrap">
        <div class="ifam-card ifam-elevation">
            <h2 class="ifam-title"><?php echo esc_html($f['title'] ?? 'Credentials'); ?></h2>

            <ul class="ifam-tabs" role="tablist">
                <li class="ifam-tab ifam-active" data-tab="ifam-cred" role="tab">Credentials</li>
                <li class="ifam-tab" data-tab="ifam-del" role="tab">Delivery Method</li>
                <li class="ifam-tab" data-tab="ifam-data" role="tab">Data Management</li>
            </ul>

            <form id="ifam-form-<?php echo esc_attr($fid); ?>" class="ifam-form" novalidate>
                <div id="ifam-cred" class="ifam-panel" style="display:block;">
                    <label class="ifam-label ifam-pad">Shopify Store Domain
                        <input class="ifam-input" name="shopify_domain" type="text" value="<?php echo esc_attr($uid ? get_user_meta($uid,'shopify_domain',true) : ''); ?>">
                    </label>
                    <label class="ifam-label ifam-pad">Shopify API Token
                        <input class="ifam-input" name="shopify_token" type="password" value="">
                    </label>
                    <label class="ifam-label ifam-pad">Ads Platform
                        <select class="ifam-input" name="ads_platform">
                            <?php $cur = $uid ? get_user_meta($uid,'ads_platform',true) : ''; ?>
                            <option value="">Select one…</option>
                            <option value="google"   <?php selected($cur,'google'); ?>>Google Ads</option>
                            <option value="meta"     <?php selected($cur,'meta'); ?>>Meta Ads</option>
                            <option value="other"    <?php selected($cur,'other'); ?>>Other</option>
                        </select>
                    </label>
                    <label class="ifam-label ifam-pad">Ads API Token
                        <input class="ifam-input" name="ads_api" type="text" value="">
                    </label>
                    <div class="ifam-actions">
                        <button type="button" class="ifam-btn ifam-next" data-next="ifam-del">Next: Delivery Method →</button>
                    </div>
                </div>

                <div id="ifam-del" class="ifam-panel" style="display:none;">
                    <div class="ifam-section">
                        <div class="ifam-label ifam-pad">Delivery Method</div>
                        <div class="ifam-delivery no-border">
                            <?php if ($has_email):    ?><label class="ifam-radio"><input type="radio" name="delivery_method" value="email"> Email</label><?php endif; ?>
                            <?php if ($has_whatsapp): ?><label class="ifam-radio"><input type="radio" name="delivery_method" value="whatsapp"> WhatsApp</label><?php endif; ?>
                            <?php if ($has_slack):    ?><label class="ifam-radio"><input type="radio" name="delivery_method" value="slack"> Slack</label><?php endif; ?>
                        </div>

                        <div id="ifam-del-fields">
                            <?php if ($has_email): ?>
                            <div class="ifam-del-field" data-type="email">
                                <label class="ifam-label ifam-pad">Email
                                    <input class="ifam-input" name="delivery_email" type="email" value="">
                                </label>
                            </div>
                            <?php endif; ?>
                            <?php if ($has_whatsapp): ?>
                            <div class="ifam-del-field" data-type="whatsapp">
                                <label class="ifam-label ifam-pad">WhatsApp Number</label>
                                <input class="ifam-input ifam-wa-num" name="delivery_whatsapp_number" type="tel" placeholder="Enter phone number (with +country code)">
                                <div class="ifam-help">Compulsory: include your country code (e.g., <strong>+1</strong>, <strong>+233</strong>, <strong>+234</strong>, <strong>+54</strong>) for reliable delivery.</div>
                            </div>
                            <?php endif; ?>
                            <?php if ($has_slack): ?>
                            <div class="ifam-del-field" data-type="slack">
                                <label class="ifam-label ifam-pad">Slack Webhook / Channel
                                    <input class="ifam-input" name="delivery_slack" type="text" value="">
                                </label>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="ifam-section" style="margin-top:16px;">
                        <div class="ifam-label ifam-pad">Days</div>
                        <div class="ifam-days" id="ifam-days">
                            <?php foreach(['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] as $d){
                                echo '<label class="ifam-day"><input type="checkbox" name="delivery_days[]" value="'.esc_attr($d).'"> <span class="ifam-day-text">'.$d.'</span></label> ';
                            } ?>
                        </div>

                        <div style="margin-top:12px;">
                            <div class="ifam-label ifam-pad">Time</div>
                            <select class="ifam-input" name="delivery_time">
                                <?php
                                if ($times) foreach($times as $t) echo '<option value="'.esc_attr($t).'">'.$t.'</option>';
                                else for ($h=8;$h<=20;$h++){ $t = sprintf('%02d:00',$h); echo '<option>'.esc_html($t).'</option>'; }
                                ?>
                            </select>
                        </div>
                    </div>

                    <div class="ifam-save-top">
                        <button type="button" class="ifam-btn ifam-save-all" data-preset="<?php echo esc_attr($preset); ?>">Save All</button>
                    </div>

                    <div class="ifam-actions ifam-actions-bottom">
                        <button type="button" class="ifam-btn ifam-prev" data-prev="ifam-cred">← Back</button>
                        <button type="button" class="ifam-btn ifam-next" data-next="ifam-data">Next: Data Management →</button>
                    </div>
                </div>

                <div id="ifam-data" class="ifam-panel" style="display:none;">
                    <div class="ifam-section">
                        <div class="ifam-label ifam-pad">Clean Saved Data</div>
                        <div class="ifam-subtext">Type <strong>"delete data"</strong> to confirm.</div>
                        <input class="ifam-input" id="ifam-delete-confirm" type="text" placeholder="delete data">
                        <div style="margin-top:8px;text-align:right">
                            <button type="button" class="ifam-btn ifam-delete" style="margin-bottom:3px;">Proceed</button>
                        </div>
                        <div class="ifam-delete-response" style="margin-top:12px"></div>
                    </div>
                    <div style="margin-top:12px;">
                        <button type="button" class="ifam-btn ifam-prev" data-prev="ifam-del">← Back</button>
                    </div>
                </div>

                <input type="hidden" name="form_id" value="<?php echo esc_attr($fid); ?>">
                <?php wp_nonce_field('ifam_front','ifam_nonce'); ?>
                <div class="ifam-response" id="ifam-response"></div>
                <div class="ifam-toast" id="ifam-toast" role="status" aria-live="polite" aria-atomic="true" style="display:none"></div>
            </form>
        </div>
        </div>
        <?php
        return ob_get_clean();
    }

    public function ajax_save_frontend(){
        check_ajax_referer('ifam_front','nonce');
        $uid = get_current_user_id();
        if ($uid <= 0) {
            wp_send_json_error(['message'=>'Login required.'], 403);
        }
        $payload = json_decode(stripslashes($_POST['payload'] ?? '{}'), true) ?: [];
        $section = sanitize_text_field($payload['section'] ?? '');
        $fid     = sanitize_text_field($payload['form_id'] ?? '');

        $can_persist = $uid > 0;

        if ($can_persist) {
            if (!empty($payload['shopify_domain'])) update_user_meta($uid,'shopify_domain', sanitize_text_field($payload['shopify_domain']));
            if (!empty($payload['shopify_token']))  update_user_meta($uid,'shopify_token',  $this->encrypt_secret($payload['shopify_token']));
            if (!empty($payload['ads_platform']))   update_user_meta($uid,'ads_platform',   sanitize_text_field($payload['ads_platform']));
            if (!empty($payload['ads_api']))        update_user_meta($uid,'ads_api',        $this->encrypt_secret($payload['ads_api']));

            if (!empty($payload['delivery_email']))    update_user_meta($uid,'delivery_value', sanitize_email($payload['delivery_email']));
            if (!empty($payload['delivery_whatsapp'])) update_user_meta($uid,'delivery_value', sanitize_text_field($payload['delivery_whatsapp']));
            if (!empty($payload['delivery_slack']))    update_user_meta($uid,'delivery_value', sanitize_text_field($payload['delivery_slack']));

            if (isset($payload['delivery_method'])) update_user_meta($uid,'delivery_method', sanitize_text_field($payload['delivery_method']));
            if (isset($payload['delivery_time']))   update_user_meta($uid,'delivery_time',   sanitize_text_field($payload['delivery_time']));
            if (!empty($payload['delivery_days']) && is_array($payload['delivery_days'])) update_user_meta($uid,'delivery_day', sanitize_text_field(implode(',', $payload['delivery_days'])));
        }


        // Map delivery_method based on delivery_preset before sending to webhook
        if ($section === 'delivery') {
            // Determine preset from stored form configuration first
            $preset_key = 'all';
            if (!empty($fid)) {
                $forms_all = get_option(self::OPT_FORMS, []);
                if (isset($forms_all[$fid]['delivery_preset'])) {
                    $preset_key = (string) $forms_all[$fid]['delivery_preset'];
                }
            }

            // Also honor any explicit preset coming from the payload (e.g. numeric codes)
            if (isset($payload['delivery_preset']) && $payload['delivery_preset'] !== '') {
                $incoming = (string) $payload['delivery_preset'];
                // Map numeric codes back to keys if needed
                if ($incoming === '1') {
                    $preset_key = 'slack_email';
                } elseif ($incoming === '2') {
                    $preset_key = 'slack_whatsapp';
                } else {
                    $preset_key = $incoming;
                }
            }

            $raw     = isset($payload['delivery_method']) ? sanitize_text_field((string) $payload['delivery_method']) : '';
            $methods = [];
            $preset_code = 'all';

            // a. If delivery_preset = "all"
            if ($preset_key === 'all') {
                $methods = ['email', 'slack', 'whatsapp'];
                $preset_code = 'all';

            // b. If delivery_preset = "slack_whatsapp"  -> methods ["slack","whatsapp"], preset code "2"
            } elseif ($preset_key === 'slack_whatsapp') {
                $methods = ['slack', 'whatsapp'];
                $preset_code = '2';

            // c. If delivery_preset = "email_slack_single" / "slack_email"  -> single method chosen by client, preset code "1"
            } elseif ($preset_key === 'slack_email' || $preset_key === 'email_slack_single') {
                if ($raw === 'email' || $raw === 'slack') {
                    $methods = [$raw];
                }
                $preset_code = '1';

            // Fallback: preserve single chosen method
            } else {
                if ($raw !== '') {
                    $methods = [$raw];
                }
                $preset_code = $preset_key;
            }

            if (!empty($methods)) {
                $payload['delivery_method'] = $methods;
            }

            // Always send a compact preset code/value to n8n
            $payload['delivery_preset'] = $preset_code;
        }

        if (!empty($fid)) {
            $forms = get_option(self::OPT_FORMS, []);
            if (isset($forms[$fid]) && !empty($forms[$fid]['webhook'])) {
                $webhook = $forms[$fid]['webhook'];
                $out = [
                    'user_id'=> $uid ?: 0,
                    'section'=>$section ?: 'unknown',
                    'data'=>$payload,
                    'timestamp'=> current_time('mysql',1)
                ];

                $api_secret = defined('IFAM_API_SECRET') ? (string)IFAM_API_SECRET : '';

                $body_json = wp_json_encode($out);
                $headers = ['Content-Type' => 'application/json'];

                if (!empty($api_secret)) {
                    $jwt = ifam_jwt_encode([
                        'iss'     => get_bloginfo('url'),
                        'iat'     => time(),
                        'uid'     => ($uid ?: 0),
                        'form_id' => $fid,
                    ], $api_secret, 300);
                    $sig = hash_hmac('sha256', $body_json, $api_secret);
                    $headers['Authorization'] = 'Bearer ' . $jwt;
                    $headers['X-Signature']   = $sig;
                }

                // --- Auth gate: verify the logged-in user is active/allowed before ingest ---
$verify_url = $forms[$fid]['verify_webhook'] ?? '';
if (empty($verify_url)) {
    wp_send_json_error(['message'=>'Verify webhook URL is not configured for this form.'], 500);
}

$verify_out = [
    'user_id'   => $uid,
    'form_id'   => $fid,
    'section'   => $section ?: 'unknown',
    'timestamp' => current_time('mysql',1),
];
$verify_body = wp_json_encode($verify_out);

$verify_headers = $headers; // includes JWT + signature when IFAM_API_SECRET is set
if (empty($api_secret)) {
    wp_send_json_error(['message'=>'Server not configured (IFAM_API_SECRET missing).'], 500);
}

// Update signature for verify body
$verify_headers['X-Signature'] = hash_hmac('sha256', $verify_body, $api_secret);

$verify_res = wp_remote_post($verify_url, [
    'headers' => $verify_headers,
    'body'    => $verify_body,
    'timeout' => 10,
]);

if (is_wp_error($verify_res)) {
    wp_send_json_error(['message'=>'Verification failed (network error).'], 403);
}
$verify_code = wp_remote_retrieve_response_code($verify_res);
$verify_json = json_decode(wp_remote_retrieve_body($verify_res), true);

if ($verify_code !== 200 || empty($verify_json) || empty($verify_json['allowed'])) {
    $msg = (is_array($verify_json) && !empty($verify_json['message'])) ? (string)$verify_json['message'] : 'Not authorized.';
    wp_send_json_error(['message'=>$msg], 403);
}

// Pass plan info through (optional)
if (!empty($verify_json['plan'])) {
    $out['plan'] = sanitize_text_field((string)$verify_json['plan']);
}

// --- Authorized: send to ingest webhook ---
wp_remote_post($webhook, ['headers'=>$headers,'body'=>$body_json,'timeout'=>10]);
}
        }

        wp_send_json_success(['message'=>'Saved successfully!!']);
    }

    public function ajax_delete_data(){
        check_ajax_referer('ifam_front','nonce');
        $uid = get_current_user_id();
        if ($uid <= 0) {
            wp_send_json_error(['message'=>'Login required.'], 403);
        }
        $reason = sanitize_text_field($_POST['reason'] ?? '');
        $fid    = sanitize_text_field($_POST['form_id'] ?? '');

        if ($uid) {
            foreach(['shopify_domain','shopify_token','ads_platform','ads_api','delivery_value','delivery_method','delivery_day','delivery_time'] as $k) {
                delete_user_meta($uid,$k);
            }
        }
        global $wpdb;
        $wpdb->insert($wpdb->prefix . self::LOG_TABLE, [
            'user_id'=>$uid ?: null,
            'reason'=>$reason,
            'created_at'=>current_time('mysql',1)
        ], ['%d','%s','%s']);

        if (!empty($fid)) {
            $forms = get_option(self::OPT_FORMS, []);
            if (isset($forms[$fid]) && !empty($forms[$fid]['webhook'])) {
                $webhook = $forms[$fid]['webhook'];
                $out = [
                    'user_id'=> $uid ?: 0,
                    'section'=>'delete',
                    'data'=>['reason'=>$reason],
                    'timestamp'=> current_time('mysql',1)
                ];
                $api_secret = defined('IFAM_API_SECRET') ? (string)IFAM_API_SECRET : '';
                $body_json = wp_json_encode($out);
                $headers = ['Content-Type' => 'application/json'];
                if (!empty($api_secret)) {
                    $jwt = ifam_jwt_encode([
                        'iss'     => get_bloginfo('url'),
                        'iat'     => time(),
                        'uid'     => ($uid ?: 0),
                        'form_id' => $fid,
                    ], $api_secret, 300);
                    $sig = hash_hmac('sha256', $body_json, $api_secret);
                    $headers['Authorization'] = 'Bearer ' . $jwt;
                    $headers['X-Signature']   = $sig;
                }
                wp_remote_post($webhook, ['headers'=>$headers,'body'=>$body_json,'timeout'=>10]);
            }
        }

        wp_send_json_success(['message'=>'Data deleted']);
    }

    public function register_rest_routes(){
        register_rest_route('ifam/v1','/credentials/(?P<uid>\d+)', [
            'methods'=>'GET',
            'callback'=>[$this,'rest_get_credentials'],
            'permission_callback'=>[$this,'rest_permission']
        ]);
    }

public function rest_permission($req){
    // Allow either a valid Bearer JWT (preferred) OR a signed token query param.
    $secret = defined('IFAM_API_SECRET') ? (string)IFAM_API_SECRET : '';
    if (empty($secret)) return false;

    $uid = intval($req->get_param('uid'));
    if ($uid <= 0) return false;

    // 1) Bearer JWT
    $auth = $req->get_header('authorization');
    if (!empty($auth) && stripos($auth, 'bearer ') === 0) {
        $jwt = trim(substr($auth, 7));
        $claims = ifam_jwt_decode_verify($jwt, $secret);
        if (is_array($claims) && intval($claims['uid'] ?? 0) === $uid) {
            return true;
        }
    }

    // 2) Signed token (fallback)
    $token = (string) $req->get_param('token');
    if (!empty($token)) {
        $expected = hash_hmac('sha256', 'cred:' . $uid, $secret);
        if (hash_equals($expected, $token)) {
            return true;
        }
    }

    return false;
}

    public function rest_get_credentials($req){
        $uid   = intval($req->get_param('uid'));
        $token = $req->get_param('token');
        if (!$uid) return new WP_Error('bad_request','Missing uid',['status'=>400]);
        $secret = defined('IFAM_API_SECRET') ? (string)IFAM_API_SECRET : '';
        if (empty($secret)) return new WP_Error('no_secret','Server not configured',['status'=>500]);
        return rest_ensure_response([
            'shopify_domain'=>get_user_meta($uid,'shopify_domain',true),
            'shopify_token' =>$this->decrypt_secret(get_user_meta($uid,'shopify_token',true)),
            'ads_platform'  =>get_user_meta($uid,'ads_platform',true),
            'ads_api'       =>$this->decrypt_secret(get_user_meta($uid,'ads_api',true)),
            'delivery_method'=>get_user_meta($uid,'delivery_method',true),
            'delivery_value' =>get_user_meta($uid,'delivery_value',true),
            'delivery_day'   =>get_user_meta($uid,'delivery_day',true),
            'delivery_time'  =>get_user_meta($uid,'delivery_time',true)
        ]);
    }

    public function admin_menu(){
        add_menu_page('InsightFlow Automation','InsightFlow Automation','manage_options','ifam',[$this,'admin_page'],'dashicons-chart-area',60);
        add_submenu_page('ifam','Form Editor','Form Editor','manage_options','ifam-editor',[$this,'admin_editor_page']);
        add_submenu_page('ifam','Logs','Logs','manage_options','ifam-logs',[$this,'admin_logs_page']);
        add_submenu_page('ifam','JWT Tool','JWT Tool','manage_options','ifam-jwt',[$this,'admin_jwt_tool']);
    }

    public function admin_page(){
        if (!current_user_can('manage_options')) return;
        $forms  = get_option(self::OPT_FORMS, []);
        ?>
        <div class="wrap"><h1>InsightFlow Automation Manager</h1>

            <h2>Global Settings</h2>
            <div class="notice notice-info"><p><strong>API Secret now comes from <code>wp-config.php</code></strong>. Define <code>IFAM_API_SECRET</code> there. The field has been removed from this page for security.</p></div>

            <p><a href="<?php echo esc_url(admin_url('admin.php?page=ifam-editor&new=1')); ?>" class="page-title-action" id="ifam-add-btn">Add New Form</a></p>

            <table class="widefat fixed striped">
                <thead><tr><th>Title (click to edit)</th><th>Shortcode</th><th>Author</th><th>Date</th><th>Delivery</th><th>Schedules</th><th>Actions</th></tr></thead>
                <tbody>
                <?php foreach($forms as $fid=>$f): ?>
                    <tr data-fid="<?php echo esc_attr($fid); ?>">
                        <td><span class="ifam-inline-title" contenteditable="true" data-fid="<?php echo esc_attr($fid); ?>"><?php echo esc_html($f['title']); ?></span></td>
                        <td><code>[saas_credentials_form id="<?php echo esc_attr($f['id']); ?>"]</code></td>
                        <td><?php echo esc_html($f['author']); ?></td>
                        <td><?php echo esc_html(date('Y-m-d H:i', strtotime($f['date']))); ?></td>
                        <td><?php echo esc_html(implode(', ', (array)$f['delivery_options'])); ?></td>
                        <td><?php echo esc_html(implode(', ', (array)$f['schedules'])); ?></td>
                        <td>
                            <div class="ifam-action-group">
                                <a class="button" style="margin-bottom:3px;" href="<?php echo esc_url(admin_url('admin.php?page=ifam-editor&form_id='.esc_attr($f['id']))); ?>">Edit</a>
                                <button class="button ifam-delete-form" style="background:#ff4d4f;color:#fff;border:0;margin-bottom:3px;" data-fid="<?php echo esc_attr($f['id']); ?>">Delete</button>
                                <button class="button ifam-dup" data-fid="<?php echo esc_attr($f['id']); ?>">Duplicate</button>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public function admin_editor_page(){
        if (!current_user_can('manage_options')) return;
        $forms = get_option(self::OPT_FORMS, []);
        $is_new = isset($_GET['new']);
        $form_id = isset($_GET['form_id']) ? sanitize_text_field($_GET['form_id']) : ($is_new ? 'form_'.time() : '');
        $editing = $form_id ? ($forms[$form_id] ?? ['id'=>$form_id,'title'=>'New Form','author'=>wp_get_current_user()->user_login,'date'=>date('c'),'delivery_preset'=>'all','delivery_options'=>['email','whatsapp','slack'],'schedules'=>['Monday'],'times'=>['09:00'],'webhook'=>'']) : null;
        $presets = ['slack_email'=>'Slack or Email only','slack_whatsapp'=>'Slack and WhatsApp only','email'=>'Email only (one day)','all'=>'All (Email, Slack & WhatsApp)'];
        ?>
        <div class="wrap">
            <?php if (isset($_GET['saved']) && $_GET['saved']==='1'): ?>
                <div class="notice notice-success is-dismissible"><p>✅ Form saved.</p></div>
            <?php endif; ?>
            <h1>Form Editor</h1>
            <p><strong>Form:</strong> <span id="ifam-editor-title-view"><?php echo esc_html($editing['title'] ?? ''); ?></span> <em>(ID: <?php echo esc_html($editing['id'] ?? ''); ?>)</em> <a href="#" id="ifam-editor-focus" class="button" style="margin-left:6px;">Edit</a></p>
            <form id="ifam-editor" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('ifam_save_form','ifam_form_nonce'); ?>
                <input type="hidden" name="action" value="ifam_save_form">
                <input type="hidden" name="form_id" id="ifam-editor-id" value="<?php echo esc_attr(isset($editing['id']) ? $editing['id'] : ''); ?>">
                <table class="form-table">
                    <tr><th>Title</th><td><input name="title" id="ifam-editor-title-inp" style="width:60%" value="<?php echo esc_attr($editing['title'] ?? ''); ?>"></td></tr>
                    <tr><th>Delivery Preset</th><td>
                        <select name="delivery_preset" id="ifam-editor-preset">
                            <?php
                            $curp = $editing['delivery_preset'] ?? 'all';
                            foreach($presets as $k=>$v){
                                echo '<option value="'.esc_attr($k).'" '.selected($curp,$k,false).'>'.esc_html($v).'</option>';
                            }
                            ?>
                        </select>
                        <p class="description">Preset controls allowed delivery methods and client day selection limit.</p>
                    </td></tr>
                    <tr><th>Delivery Options</th><td>
                        <?php $dopts = (array)($editing['delivery_options'] ?? ['email']); ?>
                        <label><input type="checkbox" class="ifam-opt" name="delivery_options[]" value="email"    <?php checked(in_array('email',$dopts,true)); ?>> Email</label>
                        <label style="margin-left:10px"><input type="checkbox" class="ifam-opt" name="delivery_options[]" value="whatsapp" <?php checked(in_array('whatsapp',$dopts,true)); ?>> WhatsApp</label>
                        <label style="margin-left:10px"><input type="checkbox" class="ifam-opt" name="delivery_options[]" value="slack"    <?php checked(in_array('slack',$dopts,true)); ?>> Slack</label>
                        <p class="description" id="ifam-preset-hint"></p>
                    </td></tr>
                    <tr><th>Schedules (comma separated)</th><td><input name="schedules" id="ifam-editor-schedules" style="width:60%" value="<?php echo esc_attr(implode(',', (array)($editing['schedules'] ?? []))); ?>"></td></tr>
                    <tr><th>Times (comma separated)</th><td><input name="times" id="ifam-editor-times" style="width:60%" value="<?php echo esc_attr(implode(',', (array)($editing['times'] ?? []))); ?>"></td></tr>
                    <tr><th>Webhook URL</th><td><input name="webhook" id="ifam-editor-webhook" style="width:60%" value="<?php echo esc_attr($editing['webhook'] ?? ''); ?>"></td></tr>
                </table>
                <p class="submit"><button class="button button-primary">Save Form</button> <a class="button" href="<?php echo esc_url(admin_url('admin.php?page=ifam')); ?>">Back to Forms</a></p>
            </form>
            <script>
                (function($){
                    function applyPreset(p){
                        var map = {
                            'slack_email': ['slack','email'],
                            'slack_whatsapp': ['slack','whatsapp'],
                            'email': ['email'],
                            'all': ['email','whatsapp','slack']
                        };
                        var allowed = map[p] || map['all'];
                        $('.ifam-opt').prop('checked', false).prop('disabled', true);
                        allowed.forEach(function(v){ $('.ifam-opt[value="'+v+'"]').prop('checked', true); });
                        $('.ifam-opt').each(function(){
                            var v = $(this).val();
                            $(this).prop('disabled', allowed.indexOf(v)===-1);
                        });
                        $('#ifam-preset-hint').text('Preset "'+p.replace('_',' & ')+'" active: '+allowed.join(', ')+'.');
                    }
                    applyPreset($('#ifam-editor-preset').val());
                    $('#ifam-editor-preset').on('change', function(){ applyPreset(this.value); });
                    $('#ifam-editor-focus').on('click', function(e){ e.preventDefault(); $('#ifam-editor-title-inp').focus(); });
                    $('#ifam-editor-title-inp').on('input', function(){ $('#ifam-editor-title-view').text($(this).val()); });
                })(jQuery);
            </script>
        </div>
        <?php
    }

    public function admin_logs_page(){
        if (!current_user_can('manage_options')) return;
        global $wpdb;
        $rows = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}".self::LOG_TABLE." ORDER BY created_at DESC LIMIT 300", ARRAY_A);
        ?>
        <div class="wrap"><h1>Deletion Logs</h1>
            <table class="widefat fixed striped">
                <thead><tr><th>ID</th><th>User</th><th>Reason</th><th>Timestamp (UTC)</th></tr></thead>
                <tbody>
                    <?php if ($rows){ foreach($rows as $r){ echo '<tr><td>'.esc_html($r['id']).'</td><td>'.esc_html($r['user_id']).'</td><td>'.esc_html($r['reason']).'</td><td>'.esc_html($r['created_at']).'</td></tr>'; } } else { echo '<tr><td colspan="4">No logs yet.</td></tr>'; } ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public function admin_jwt_tool(){
        if (!current_user_can('manage_options')) return; ?>
        <div class="wrap"><h1>JWT Tool</h1>
            <p>Generate a short-lived JWT for a user.</p>
            <input id="ifam-jwt-uid" type="number" placeholder="User ID" style="width:200px">
            <button class="button button-primary" id="ifam-gen-jwt">Generate</button>
            <pre id="ifam-jwt-out" style="margin-top:12px;white-space:pre-wrap;"></pre>
        </div>
        <script>
        jQuery(function($){
            $('#ifam-gen-jwt').on('click', function(e){
                e.preventDefault();
                var uid = parseInt($('#ifam-jwt-uid').val(),10)||0;
                if(!uid) return alert('Enter a valid User ID');
                $.post(ajaxurl, { action:'ifam_admin_generate_jwt', uid:uid, _wpnonce: IFAM_ADMIN.nonce }, function(resp){
                    if(resp.success) $('#ifam-jwt-out').text(resp.data.token);
                    else alert(resp.data && resp.data.message ? resp.data.message : 'Error');
                }, 'json');
            });
        });
        </script>
        <?php
    }

    public function handle_admin_save_form(){
        if (!current_user_can('manage_options')) wp_die('no');
        check_admin_referer('ifam_save_form','ifam_form_nonce');

        $forms = get_option(self::OPT_FORMS, []);
        $fid   = sanitize_text_field($_POST['form_id'] ?? ('form_'.time()));
        $title = sanitize_text_field($_POST['title'] ?? 'Untitled');
        $preset   = sanitize_text_field($_POST['delivery_preset'] ?? 'all');

        if ($preset === 'slack_email')        $delivery_options = ['slack','email'];
        elseif ($preset === 'slack_whatsapp') $delivery_options = ['slack','whatsapp'];
        elseif ($preset === 'email')           $delivery_options = ['email'];
        else                                  $delivery_options = ['email','whatsapp','slack'];

        if (isset($_POST['delivery_options'])) {
            $manual = array_map('sanitize_text_field', (array)$_POST['delivery_options']);
            if ($manual) $delivery_options = $manual;
        }

        $schedules = isset($_POST['schedules']) ? array_map('trim', explode(',', sanitize_text_field($_POST['schedules']))) : ['Monday'];
        $times     = isset($_POST['times'])     ? array_map('trim', explode(',', sanitize_text_field($_POST['times'])))     : ['09:00'];
        $webhook   = esc_url_raw($_POST['webhook'] ?? '');
        $verify_webhook = esc_url_raw($_POST['verify_webhook'] ?? '');

        $forms[$fid] = [
            'id'=>$fid,
            'title'=>$title,
            'author'=>wp_get_current_user()->user_login,
            'date'=>date('c'),
            'delivery_preset'=>$preset,
            'delivery_options'=>$delivery_options,
            'schedules'=>$schedules,
            'times'=>$times,
            'webhook'=>$webhook
        
            'verify_webhook' => $verify_webhook,];
        update_option(self::OPT_FORMS, $forms);
        wp_redirect(admin_url('admin.php?page=ifam-editor&form_id='.$fid.'&saved=1')); exit;
    }

    public function ajax_update_title(){
        check_ajax_referer('ifam_admin','_wpnonce');
        if (!current_user_can('manage_options')) wp_send_json_error(['message'=>'Not allowed']);
        $fid   = sanitize_text_field($_POST['fid'] ?? '');
        $title = sanitize_text_field($_POST['title'] ?? '');
        if (!$fid || $title==='') wp_send_json_error(['message'=>'Bad params']);
        $forms = get_option(self::OPT_FORMS, []);
        if (!isset($forms[$fid])) wp_send_json_error(['message'=>'Form not found']);
        $forms[$fid]['title'] = $title;
        update_option(self::OPT_FORMS,$forms);
        wp_send_json_success(['message'=>'Title updated']);
    }

    public function ajax_delete_form(){
        check_ajax_referer('ifam_admin','_wpnonce');
        if (!current_user_can('manage_options')) wp_send_json_error(['message'=>'Not allowed']);
        $fid = sanitize_text_field($_POST['fid'] ?? '');
        $forms = get_option(self::OPT_FORMS, []);
        if (isset($forms[$fid])){ unset($forms[$fid]); update_option(self::OPT_FORMS,$forms); wp_send_json_success(['message'=>'deleted']); }
        wp_send_json_error(['message'=>'not found']);
    }

    public function ajax_duplicate_form(){
        check_ajax_referer('ifam_admin','_wpnonce');
        if (!current_user_can('manage_options')) wp_send_json_error(['message'=>'Not allowed']);
        $fid = sanitize_text_field($_POST['fid'] ?? '');
        $forms = get_option(self::OPT_FORMS, []);
        if (!isset($forms[$fid])) wp_send_json_error(['message'=>'not found']);
        $nid = $fid . '_copy_' . time();
        $copy = $forms[$fid];
        $copy['id'] = $nid;
        $copy['title'] .= ' (Copy)';
        $copy['date']  = date('c');
        $forms[$nid] = $copy;
        update_option(self::OPT_FORMS,$forms);
        wp_send_json_success(['message'=>'duplicated','fid'=>$nid]);
    }

    public function ajax_admin_generate_jwt(){
        check_ajax_referer('ifam_admin','_wpnonce');
        if (!current_user_can('manage_options')) wp_send_json_error(['message'=>'Not allowed']);
        $uid = isset($_POST['uid']) ? intval($_POST['uid']) : 0;
        if (!$uid) wp_send_json_error(['message'=>'Invalid user id']);
        $secret = defined('IFAM_API_SECRET') ? (string)IFAM_API_SECRET : '';
        if (empty($secret)) wp_send_json_error(['message'=>'API secret not set in wp-config.php']);
        $token = $this->jwt_encode(['uid'=>$uid], $secret, 300);
        update_user_meta($uid,'ifam_jwt',$token);
        wp_send_json_success(['token'=>$token]);
    }
}
new IFAM_V6();

if (!function_exists('ifam_jwt_encode')) {
    function ifam_jwt_encode($claims, $secret, $ttl = 300) {
        if (!is_array($claims)) { $claims = []; }
        if ($ttl > 0) { $claims['exp'] = time() + intval($ttl); }
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $b64 = function($data) {
            return rtrim(strtr(base64_encode(json_encode($data, JSON_UNESCAPED_SLASHES)), '+/', '-_'), '=');
        };
        $segments = [$b64($header), $b64($claims)];
        $signing_input = implode('.', $segments);
        $sig = hash_hmac('sha256', $signing_input, (string)$secret, true);
        $segments[] = rtrim(strtr(base64_encode($sig), '+/', '-_'), '=');
        return implode('.', $segments);
    }
}
?>
