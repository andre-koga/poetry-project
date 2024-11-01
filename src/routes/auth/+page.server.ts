import { redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:5173'
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`
    return url
}

export const actions: Actions = {
    // signup: async ({ request, locals: { supabase } }) => {
    //     const formData = await request.formData()
    //     const email = formData.get('email') as string
    //     const password = formData.get('password') as string

    //     const { error } = await supabase.auth.signUp({ email, password })
    //     if (error) {
    //         console.error(error)
    //         redirect(303, '/auth/error')
    //     } else {
    //         redirect(303, '/')
    //     }
    // },
    // login: async ({ request, locals: { supabase } }) => {
    //     const formData = await request.formData()
    //     const email = formData.get('email') as string
    //     const password = formData.get('password') as string

    //     const { error } = await supabase.auth.signInWithPassword({ email, password })
    //     if (error) {
    //         console.error(error)
    //         redirect(303, '/auth/error')
    //     } else {
    //         redirect(303, '/private')
    //     }
    // },
    github: async ({ request, locals: { supabase } }) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: getURL(),
            },
        })

        if (error) {
            console.error(error)
            redirect(303, '/auth/error')
        } else if (data.url) {
            redirect(303, data.url) // use the redirect API for your server framework
        }
    }
}