(() => {
  const form=document.querySelector('[data-contact-form]');
  const service=new URLSearchParams(location.search).get('service');
  const select=form?.querySelector('select[name=service]');
  if(select&&service!==null&&[...select.options].some(option=>option.value===service))select.value=service;
  form?.querySelector('[data-preview-submit]')?.addEventListener('click',()=>form.requestSubmit());
 })();