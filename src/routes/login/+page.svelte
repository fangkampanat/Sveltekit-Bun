<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";

    let { form }: PageProps = $props();

    let loading = $state(false);

    $effect(() => {
        if (form?.error) {
            toast.error(form.error);
        }
    });
</script>

<svelte:head>
    <title>Login | SvelteKit Template</title>
    <meta name="description" content="Login to your account" />
</svelte:head>

<div class="min-vh-100 d-flex align-items-center justify-content-center">
    <div class="card" style="min-width: 360px;">
        <div class="card-body p-4">
            <div class="text-center mb-4">
                <i class="bi bi-person-circle fs-1 text-primary"></i>
                <h4 class="mt-2 mb-0">Login</h4>
            </div>

            <form
                method="POST"
                use:enhance={() => {
                    loading = true;
                    return async ({ update }) => {
                        loading = false;
                        await update();
                    };
                }}
            >
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-person"></i>
                        </span>
                        <input
                            type="text"
                            class="form-control"
                            id="username"
                            name="username"
                            required
                            autocomplete="username"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div class="mb-4">
                    <label for="password" class="form-label">Password</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-lock"></i>
                        </span>
                        <input
                            type="password"
                            class="form-control"
                            id="password"
                            name="password"
                            required
                            autocomplete="current-password"
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    class="btn btn-primary w-100"
                    disabled={loading}
                >
                    {#if loading}
                        <span
                            class="spinner-border spinner-border-sm me-2"
                            role="status"
                        ></span>
                        Logging in...
                    {:else}
                        <i class="bi bi-box-arrow-in-right me-2"></i>
                        Login
                    {/if}
                </button>
            </form>
        </div>
    </div>
</div>
