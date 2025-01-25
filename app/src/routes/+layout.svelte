<script>
    let { children } = $props();
</script>

<div>
    {@render children()}
</div>

<style>
    :global(body) {
        font-family:Verdana, Geneva, Tahoma, sans-serif;
        background: rgb(29,167,0);
        background: radial-gradient(circle, rgba(29,167,0,1) 46%, rgb(4, 64, 0) 100%);
        height: 100%;
        margin: 0;
        overflow:auto;
    }

</style>