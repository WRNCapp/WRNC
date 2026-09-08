import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

const KIT_FORM_UID = '9cf45d2196';
const KIT_FORM_SCRIPT = `https://wrnc.kit.com/${KIT_FORM_UID}/index.js`;
const KIT_FORM_STYLE_ID = 'wrnc-kit-launch-list-styles';
const KIT_FORM_STYLES = `
.formkit-form[data-uid="${KIT_FORM_UID}"] { border-color:#34373d!important; box-shadow:0 18px 60px rgba(0,0,0,.28)!important; }
.formkit-form[data-uid="${KIT_FORM_UID}"] [data-style="minimal"] { padding:32px!important; }
.formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-header { margin:0 0 10px!important; font-size:28px!important; line-height:1.15!important; }
.formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-header h2 { margin:0!important; line-height:1.15!important; }
.formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-subheader { margin:0 0 20px!important; font-size:17px!important; line-height:1.45!important; }
.formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-fields { margin:0 auto!important; }
.formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-input,
.formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-submit { min-height:52px!important; }
.formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-input:focus,
.formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-submit:focus-visible { outline:3px solid rgba(255,100,0,.48)!important; outline-offset:2px!important; border-color:#ff6400!important; }
@media(max-width:480px) {
  .formkit-form[data-uid="${KIT_FORM_UID}"] [data-style="minimal"] { padding:24px 20px!important; }
  .formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-header { font-size:27px!important; }
  .formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-subheader,
  .formkit-form[data-uid="${KIT_FORM_UID}"] .formkit-input { font-size:16px!important; }
}`;

export function KitLaunchListForm() {
  const hostRef = useRef<View>(null);

  useEffect(() => {
    const host = hostRef.current as unknown as HTMLElement | null;
    if (
      !host ||
      typeof host.querySelector !== 'function' ||
      typeof host.appendChild !== 'function' ||
      host.querySelector(`script[data-uid="${KIT_FORM_UID}"]`)
    ) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.dataset.uid = KIT_FORM_UID;
    script.src = KIT_FORM_SCRIPT;
    host.appendChild(script);

    let style = document.getElementById(KIT_FORM_STYLE_ID) as HTMLStyleElement | null;
    const ownsStyle = !style;
    if (!style) {
      style = document.createElement('style');
      style.id = KIT_FORM_STYLE_ID;
      style.textContent = KIT_FORM_STYLES;
      document.head.appendChild(style);
    }

    const enhanceEmailInput = () => {
      const input = host.querySelector<HTMLInputElement>('input[name="email_address"]');
      if (!input) return false;
      input.type = 'email';
      input.autocomplete = 'email';
      input.inputMode = 'email';
      input.autocapitalize = 'none';
      input.spellcheck = false;
      return true;
    };

    const observer = new MutationObserver(() => {
      if (enhanceEmailInput()) observer.disconnect();
    });
    if (!enhanceEmailInput()) observer.observe(host, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      script.remove();
      if (ownsStyle) style?.remove();
    };
  }, []);

  return (
    <View
      accessibilityLabel="Join the WRNC Launch List"
      nativeID="wrnc-launch-list"
      ref={hostRef}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 34,
    maxWidth: 700,
    width: '100%',
  },
});
