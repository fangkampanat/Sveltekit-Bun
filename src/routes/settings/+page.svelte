<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";

    let { data, form }: PageProps = $props();

    let isSubmitting = $state(false);

    $effect(() => {
        if (form?.success) {
            toast.success(form.message);
        } else if (form?.error) {
            toast.error(form.error);
        }
    });
</script>

<svelte:head>
    <title>Settings | SvelteKit Template</title>
    <meta name="description" content="Account settings and preferences" />
</svelte:head>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">
            <i class="bi bi-gear me-2"></i>
            Settings
        </h1>
        <a href="/" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-arrow-left me-1"></i>
            Back to Dashboard
        </a>
    </div>

    <div class="row g-4">
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="bi bi-key me-2"></i>
                        Change Password
                    </h5>
                </div>
                <div class="card-body">
                    <form
                        method="POST"
                        action="?/changePassword"
                        use:enhance={() => {
                            isSubmitting = true;
                            return async ({ update }) => {
                                await update({ reset: true });
                                isSubmitting = false;
                            };
                        }}
                    >
                        <div class="mb-3">
                            <label for="currentPassword" class="form-label">
                                Current Password
                            </label>
                            <input
                                type="password"
                                class="form-control"
                                id="currentPassword"
                                name="currentPassword"
                                required
                                autocomplete="current-password"
                            />
                        </div>

                        <div class="mb-3">
                            <label for="newPassword" class="form-label">
                                New Password
                            </label>
                            <input
                                type="password"
                                class="form-control"
                                id="newPassword"
                                name="newPassword"
                                required
                                minlength="6"
                                autocomplete="new-password"
                            />
                            <div class="form-text">
                                Password must be at least 6 characters
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="confirmPassword" class="form-label">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                class="form-control"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                minlength="6"
                                autocomplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            class="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {#if isSubmitting}
                                <span
                                    class="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Changing...
                            {:else}
                                <i class="bi bi-check-lg me-1"></i>
                                Change Password
                            {/if}
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {#if data.user?.username === "admin"}
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-people me-2"></i>
                            User Management
                        </h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text text-muted mb-3">
                            Manage system users, create new accounts, and reset
                            passwords.
                        </p>
                        <a
                            href="/settings/users"
                            class="btn btn-outline-primary"
                        >
                            <i class="bi bi-arrow-right me-1"></i>
                            Manage Users
                        </a>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
