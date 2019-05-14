export default async ({ app, redirect, store }) => {
  if (!app.$auth.isAuthenticated()) return redirect('/')
  try {
    const roles = await app.$api.get(
      `/auth/users/${store.state.auth.user.sub}/roles`
    )
    if (!roles.data.find(r => r.name === 'Admin'))
      throw new Error('Insufficient permissions')
  } catch (err) {
    console.error(err)
    redirect('/')
  }
}
