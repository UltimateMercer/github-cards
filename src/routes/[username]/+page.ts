import type { User } from "../../types";

  interface LoadParams {
    params: Record<string, string>;
    fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>;
  }
  
  interface LoadResult {
    user: User;
  }

  /**
   * Loads user data from the GitHub API.
   * @param {LoadParams} { params, fetch }
   * @returns {Promise<LoadResult>} A promise that resolves with user data.
   * @throws {Error} When the user is not found.
   */
  export async function load({ params, fetch }: LoadParams): Promise<LoadResult> {
    const res = await fetch(`https://api.github.com/users/${params.username}`);
    if (!res.ok) {
      throw new Error('User not found');
    }

    const user: User = await res.json();
    console.log(user);
    return { user };
  }