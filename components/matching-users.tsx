"use client";

import { useEffect, useState } from "react";
import { MatchingUser } from "@/types/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MatchingUsers() {
  const [matches, setMatches] = useState<MatchingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/matching-users");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch matches");
        }

        const data = await response.json();
        setMatches(data.matches || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Matching Users</CardTitle>
          <CardDescription>Finding users that match your preferences...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Matching Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 py-4">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matching Users</CardTitle>
        <CardDescription>
          Users that match your gender preferences ({matches.length} {matches.length === 1 ? 'match' : 'matches'})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No matching users found. Make sure your profile and preferences are set up correctly.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((user) => (
              <Card key={user.id} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{user.email}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-col gap-2 mt-2">
                      <div>
                        <span className="font-medium">Gender: </span>
                        <Badge variant="outline">{user.gender}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">Interested in: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.gender_preference.map((pref) => (
                            <Badge key={pref} variant="secondary" className="text-xs">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

