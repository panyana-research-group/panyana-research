export default ({ app, redirect, store }) => {
  if (!app.$cookies.get('loggedIn')) return redirect('/')
}
