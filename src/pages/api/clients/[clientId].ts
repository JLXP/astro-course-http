import type { APIRoute } from "astro";
import { Clients, db, eq } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const clientId = params.clientId ?? "";

  try {
    const clients = await db
      .select()
      .from(Clients)
      .where(eq(Clients.id, +clientId));

    if (clients.length === 0) {
      return new Response(
        JSON.stringify({ msg: `Client with id ${clientId} not found` }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify(clients.at(0)), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        msg: "not found",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const clientId = params.clientId ?? "";

  try {
    const body = {
      method: "PATCH",
      clientId: clientId,
    };

    const { id, ...rest } = await request.json();
    //update xxx= xxx, from Tabla
    const results = await db
      .update(Clients)
      .set(rest)
      .where(eq(Clients.id, +clientId));
    const updateClient = await db
      .select()
      .from(Clients)
      .where(eq(Clients.id, +clientId));

    return new Response(JSON.stringify(updateClient.at(0)), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        msg: "not found",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const clientId = params.clientId ?? "";

  try {
    const body = {
      method: "DELETE",
      clientId: +clientId!,
    };

    const { rowsAffected } = await db
      .delete(Clients)
      .where(eq(Clients.id, +clientId));

    if (rowsAffected > 0) {
      return new Response(JSON.stringify({ msg: "Deleted" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({ msg: `Client with id ${clientId} not found` }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ msg: error }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
