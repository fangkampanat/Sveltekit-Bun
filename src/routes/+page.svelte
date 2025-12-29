<script lang="ts">
    import type { PageProps } from "./$types";
    import { toast } from "svelte-sonner";
    import { enhance } from "$app/forms";
    import ConfirmDialog from "$lib/components/ConfirmDialog.svelte";

    let { data }: PageProps = $props();

    let confirmDialog: ConfirmDialog;

    function handleTestDialog() {
        confirmDialog.open();
    }

    function onConfirm() {
        toast.success("Confirmed!");
    }
</script>

<svelte:head>
    <title>Dashboard | SvelteKit Template</title>
    <meta name="description" content="SvelteKit Bun Template Dashboard" />
</svelte:head>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">
            <i class="bi bi-speedometer2 me-2"></i>
            Dashboard
        </h1>
        <div class="dropdown">
            <button
                class="btn btn-outline-secondary btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="User menu"
            >
                <i class="bi bi-person-circle me-1"></i>
                {data.user?.username}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li>
                    <a class="dropdown-item" href="/settings">
                        <i class="bi bi-gear me-2"></i>
                        Settings
                    </a>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                    <form action="/logout" method="POST" use:enhance>
                        <button type="submit" class="dropdown-item text-danger">
                            <i class="bi bi-box-arrow-right me-2"></i>
                            Logout
                        </button>
                    </form>
                </li>
            </ul>
        </div>
    </div>

    <div class="card">
        <div class="card-body">
            <h5 class="card-title">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                Welcome!
            </h5>
            <p class="card-text text-muted mb-0">
                Your SvelteKit + Bun template is ready. Start building your
                application!
            </p>
        </div>
    </div>

    <div class="row mt-4">
        <div class="col-md-4">
            <div class="card">
                <div class="card-body text-center">
                    <i
                        class="bi bi-lightning-charge-fill text-warning fs-1 mb-2"
                    ></i>
                    <h6 class="card-title">Bun Runtime</h6>
                    <p class="card-text small text-muted mb-0">
                        Fast JavaScript runtime
                    </p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body text-center">
                    <i class="bi bi-database-fill text-primary fs-1 mb-2"></i>
                    <h6 class="card-title">SQLite + Drizzle</h6>
                    <p class="card-text small text-muted mb-0">
                        Type-safe database
                    </p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body text-center">
                    <i class="bi bi-shield-lock-fill text-success fs-1 mb-2"
                    ></i>
                    <h6 class="card-title">Secure Auth</h6>
                    <p class="card-text small text-muted mb-0">
                        HMAC signed cookies
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Test ConfirmDialog Section -->
    <div class="mt-4">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">
                    <i class="bi bi-window-stack me-2"></i>
                    Component Test
                </h5>
                <p class="card-text text-muted mb-3">
                    Test the ConfirmDialog component
                </p>
                <button
                    type="button"
                    class="btn btn-danger"
                    onclick={handleTestDialog}
                >
                    <i class="bi bi-trash me-1"></i>
                    Test Delete Dialog
                </button>
            </div>
        </div>
    </div>
</div>

<ConfirmDialog
    bind:this={confirmDialog}
    title="Delete Item"
    message="Are you sure you want to delete this item? This action cannot be undone."
    confirmText="Delete"
    confirmVariant="danger"
    onconfirm={onConfirm}
/>
