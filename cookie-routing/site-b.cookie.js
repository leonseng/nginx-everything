function setCookie() {
  document.cookie = "site=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  alert("Removed cookie 'site'. Reloading page...")
  location.reload(true);
}
