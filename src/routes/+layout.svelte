<script lang="ts">
	import type { LayoutProps } from "./$types";
	import { onMount } from "svelte";
	import "bootstrap/dist/css/bootstrap.min.css";
	import "bootstrap-icons/font/bootstrap-icons.min.css";
	import "../app.css";

	import { Toaster } from "svelte-sonner";
	import favicon from "$lib/assets/favicon.svg";

	let { children, data }: LayoutProps = $props();

	// Load Bootstrap JS only on client-side (requires DOM)
	onMount(async () => {
		// @ts-ignore - Bootstrap bundle doesn't have type declarations
		await import("bootstrap/dist/js/bootstrap.bundle.min.js");
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster
	expand={true}
	position="bottom-center"
	theme="dark"
	richColors
	toastOptions={{ style: 'font-family: "Google Sans";' }}
/>

{@render children()}
