export default ({ redirect, store }) => {
  if (store.state.auth.loggedIn) {
    return redirect('/')
  }
}
