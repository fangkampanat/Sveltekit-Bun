<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";
    import ConfirmDialog from "$lib/components/ConfirmDialog.svelte";
    import { formatDateTime } from "$lib/utils";

    let { data, form }: PageProps = $props();

    let isSubmitting = $state(false);
    let confirmDialog: ConfirmDialog;
    let userToDelete: { id: string; username: string } | null = $state(null);
    let deleteForm: HTMLFormElement;
    let editingUser: { id: string; username: string } | null = $state(null);

    $effect(() => {
        if (form?.success) {
            toast.success(form.message);
            editingUser = null;
        } else if (form?.error) {
            toast.error(form.error);
        }
    });

    function handleDeleteClick(user: { id: string; username: string }) {
        userToDelete = user;
        confirmDialog.open();
    }

    function handleEditClick(user: { id: string; username: string }) {
        editingUser = user;
    }

    function cancelEdit() {
        editingUser = null;
    }
</script>

<svelte:head>
    <title>User Management | SvelteKit Template</title>
    <meta name="description" content="Manage system users" />
</svelte:head>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">
            <i class="bi bi-people me-2"></i>
            User Management
        </h1>
        <a href="/settings" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-arrow-left me-1"></i>
            Back to Settings
        </a>
    </div>

    <div class="row g-4">
        <!-- Create User Card -->
        <div class="col-lg-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">
                        <i class="bi bi-person-plus me-2"></i>
                        Create New User
                    </h5>
                </div>
                <div class="card-body">
                    <form
                        method="POST"
                        action="?/createUser"
                        use:enhance={() => {
                            isSubmitting = true;
                            return async ({ update }) => {
                                await update({ reset: true });
                                isSubmitting = false;
                            };
                        }}
                    >
                        <div class="mb-3">
                            <label for="username" class="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                class="form-control"
                                id="username"
                                name="username"
                                required
                                minlength="3"
                                autocomplete="off"
                            />
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                class="form-control"
                                id="password"
                                name="password"
                                required
                                minlength="6"
                                autocomplete="new-password"
                            />
                            <div class="form-text">At least 6 characters</div>
                        </div>
                        <button
                            type="submit"
                            class="btn btn-primary w-100"
                            disabled={isSubmitting}
                        >
                            {#if isSubmitting}
                                <span
                                    class="spinner-border spinner-border-sm me-1"
                                    role="status"
                                ></span>
                                Creating...
                            {:else}
                                <i class="bi bi-plus-lg me-1"></i>
                                Create User
                            {/if}
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Users List -->
        <div class="col-lg-8">
            <div class="card">
                <div
                    class="card-header d-flex justify-content-between align-items-center"
                >
                    <h5 class="card-title mb-0">
                        <i class="bi bi-list-ul me-2"></i>
                        System Users
                    </h5>
                    <span class="badge bg-secondary"
                        >{data.users.length} users</span
                    >
                </div>
                <div class="card-body p-0">
                    {#if data.users.length === 0}
                        <div class="text-center py-5 text-muted">
                            <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                            No users found
                        </div>
                    {:else}
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Created</th>
                                        <th class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each data.users as user (user.id)}
                                        <tr>
                                            <td>
                                                <i
                                                    class="bi bi-person-circle me-2 text-muted"
                                                ></i>
                                                {user.username}
                                            </td>
                                            <td class="text-muted small">
                                                {formatDateTime(
                                                    user.created_at,
                                                )}
                                            </td>
                                            <td class="text-end">
                                                <button
                                                    type="button"
                                                    class="btn btn-sm btn-outline-primary me-1"
                                                    onclick={() =>
                                                        handleEditClick(user)}
                                                    aria-label="Edit password for {user.username}"
                                                >
                                                    <i class="bi bi-key"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    class="btn btn-sm btn-outline-danger"
                                                    onclick={() =>
                                                        handleDeleteClick(user)}
                                                    aria-label="Delete user {user.username}"
                                                >
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Edit Password Modal -->
{#if editingUser}
    <button
        type="button"
        class="modal-backdrop show"
        onclick={cancelEdit}
        aria-label="Close modal"
    ></button>
    <div class="modal d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-key me-2"></i>
                        Change Password
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        onclick={cancelEdit}
                        aria-label="Close"
                    ></button>
                </div>
                <form
                    method="POST"
                    action="?/updatePassword"
                    use:enhance={() => {
                        isSubmitting = true;
                        return async ({ update }) => {
                            await update({ reset: false });
                            isSubmitting = false;
                        };
                    }}
                >
                    <div class="modal-body">
                        <input
                            type="hidden"
                            name="userId"
                            value={editingUser.id}
                        />
                        <p class="text-muted mb-3">
                            Set new password for <strong
                                >{editingUser.username}</strong
                            >
                        </p>
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
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-outline-secondary"
                            onclick={cancelEdit}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {#if isSubmitting}
                                <span
                                    class="spinner-border spinner-border-sm me-1"
                                ></span>
                                Saving...
                            {:else}
                                <i class="bi bi-check-lg me-1"></i>
                                Update Password
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}

<!-- Delete Confirmation Dialog -->
<ConfirmDialog
    bind:this={confirmDialog}
    title="Delete User"
    message="Are you sure you want to delete user '{userToDelete?.username}'? This action cannot be undone."
    confirmText="Delete"
    confirmVariant="danger"
    onconfirm={() => {
        if (userToDelete) {
            deleteForm.requestSubmit();
        }
    }}
/>

<form
    method="POST"
    action="?/deleteUser"
    use:enhance={() => {
        isSubmitting = true;
        return async ({ update }) => {
            await update();
            isSubmitting = false;
        };
    }}
    bind:this={deleteForm}
    hidden
>
    <input type="hidden" name="userId" value={userToDelete?.id ?? ""} />
</form>

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 1040;
    }

    .modal {
        z-index: 1050;
    }

    .modal-content {
        background: var(--surface-glass, #1a1d26);
        border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
        border-radius: 16px;
    }

    .modal-header {
        border-bottom-color: var(--border-subtle, rgba(255, 255, 255, 0.06));
    }

    .modal-footer {
        border-top-color: var(--border-subtle, rgba(255, 255, 255, 0.06));
    }
</style>
