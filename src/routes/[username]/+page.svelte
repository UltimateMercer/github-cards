
<script lang="ts">
  import type { User } from "../../types";
  export let data: { user: User };
</script>

<main class="container mx-auto font-sans my-4">
  {#if data.user}
    <article class="relative flex flex-row gap-5 md:flex-row !border rounded-lg shadow-lg transition-all bg-background/20 backdrop-blur-md backdrop-filter hover:shadow p-5">
      <img src="{data.user.avatar_url}" alt="{data.user.name}" class="rounded-lg w-48 h-48 object-cover" />
      <div class="flex flex-1 flex-col gap-1 overflow-hidden py-1">
        <h1>{data.user.name} (@{data.user.login})</h1>
        <p>Bio: {data.user.bio || 'No bio available'}</p>
        <p>Repositórios públicos: {data.user.public_repos}</p>
        <p>Seguidores: {data.user.followers}</p>
        <p>Seguindo: {data.user.following}</p>
        <a href="{data.user.html_url}" target="_blank">Ver perfil no GitHub</a>
      </div>
    </article>
  {/if}
</main>
