"use client";

import { useState } from "react";
import { Key, Plus, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface ApiKeyData {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
}

export function ApiKeys({
  keys,
  canCreate,
}: {
  keys: ApiKeyData[];
  canCreate: boolean;
}) {
  const [showAlert, setShowAlert] = useState(false);

  function handleAction(action: string) {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2500);
  }

  return (
    <div className="space-y-4">
      {showAlert && (
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-600">
          Coming soon -- API key management is under development.
        </div>
      )}

      {keys.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <Key className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No API keys yet. Create one to integrate Inpromptify into your
            workflows.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Key className="size-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{key.name}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-mono">{key.prefix}...</span>
                  <span>Created {key.createdAt}</span>
                  {key.lastUsed && <span>Last used {key.lastUsed}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAction("copy")}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                  title="Copy key prefix"
                >
                  <Copy className="size-3.5" />
                </button>
                <button
                  onClick={() => handleAction("delete")}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="Revoke key"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => handleAction("create")}
        disabled={!canCreate}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1.5"
        )}
      >
        <Plus className="size-3.5" />
        Create API Key
      </button>

      {!canCreate && (
        <p className="text-xs text-muted-foreground">
          API keys are available on Starter plans and above.{" "}
          <a href="/pricing" className="text-orange-500 hover:underline">
            Upgrade your plan
          </a>{" "}
          to get started.
        </p>
      )}
    </div>
  );
}
