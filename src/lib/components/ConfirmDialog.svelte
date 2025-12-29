<script lang="ts">
    interface Props {
        title?: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        confirmVariant?: "primary" | "danger" | "warning" | "success";
        onconfirm?: () => void;
        oncancel?: () => void;
    }

    let {
        title = "Confirm",
        message,
        confirmText = "Confirm",
        cancelText = "Cancel",
        confirmVariant = "primary",
        onconfirm,
        oncancel,
    }: Props = $props();

    let dialogRef: HTMLDialogElement;

    export function open() {
        dialogRef?.showModal();
    }

    export function close() {
        dialogRef?.close();
    }

    function handleConfirm() {
        onconfirm?.();
        close();
    }

    function handleCancel() {
        oncancel?.();
        close();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            handleCancel();
        }
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialogRef} onkeydown={handleKeydown}>
    <h5 class="mb-3">{title}</h5>
    <p class="text-muted mb-0">{message}</p>
    <div class="dialog-actions">
        <button type="button" class="btn btn-secondary" onclick={handleCancel}>
            {cancelText}
        </button>
        <button
            type="button"
            class="btn btn-{confirmVariant}"
            onclick={handleConfirm}
        >
            {confirmText}
        </button>
    </div>
</dialog>
