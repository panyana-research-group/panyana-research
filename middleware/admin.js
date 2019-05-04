export default ({ app, redirect, store }) => {
  if (!app.$cookies.get('user')) return redirect('/')
  app.$api
    .get(`/auth/users/${app.$cookies.get('user')}/roles`)
    .then(res => {
      if (!res.data.find(r => r.name === 'Admin')) return redirect('/')
    })
    .catch(err => {
      console.error(err)
      return redirect('/')
    })
}
