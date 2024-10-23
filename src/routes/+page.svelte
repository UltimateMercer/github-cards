<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as HoverCard from "$lib/components/ui/hover-card";
  import { Input } from "$lib/components/ui/input";
  import { Skeleton } from "$lib/components/ui/skeleton";
 </script>
  
 <Avatar.Root>
  <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
  <Avatar.Fallback>CN</Avatar.Fallback>
 </Avatar.Root>

 <Badge variant="outline">Outline</Badge>

 <Button variant="outline">Button</Button>

 <HoverCard.Root>
  <HoverCard.Trigger>Hover</HoverCard.Trigger>
  <HoverCard.Content>
    SvelteKit - Web development, streamlined
  </HoverCard.Content>
</HoverCard.Root>

<Input />

<Skeleton class="h-[20px] w-[100px] rounded-full" />