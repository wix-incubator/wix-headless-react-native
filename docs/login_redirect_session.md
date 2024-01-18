# Handling login/logout inside a checkout redirect session

When performing a checkout, we are opening a `WebView` and navigating to the checkout redirect session url. If there is no currently logged in member to the application (meaning we are acting as a Visitor) the user will have the ability to login as a member while inside the checkout session. This allows users to easily fill out the billing and shipping information if they are returning customers (their details would be filled in automatically once logged in).

When a user logs in while they are in a checkout session, we want them to automatically be logged in to the application when they are redirected back to the app. To acheive that, we can automatically (without user interaction) get the logged in member access token by performing a silent login.

## Login

### Detecting User Logged In During Redirect Session

When redirecting back to one of the callback urls (provided when creating a RedirectSession) Wix will add a boolean query parameter named `wixMemberLoggedIn`. If this query parameter is `true`, then the user was logged in while in the redirect session (whether logged in before starting the session, or logging in during the session). We'll use this query parameter to know whether we need to perform a silent login for the user.

### Performing a Silent Login

To get the tokens needed for the member that has just logged in, we need to perform a silent login. This can be done providing `prompt: 'none'` to the `getAuthUrl` method on the `OAuthStrategy`. This will create a URL for the Wix OAuth /authorize endpoint that doesn't display the login form if the user is already logged in.

The next part of performing the silent login is actually opening the url returned from `getAuthUrl` in a hidden `WebView` which will initiate the OAuth process securely and then by listening to the callback deep link we can finsh the OAuth process. There we'll parse the `code` and `state` params on the callback url and exchange them for member tokens with `getMemberTokens`.

### Code Example

> You can find the full code that handles login and silent login and general session management in [session.js](../authentication/session.js).

In one of our top level React Components (in this case `WixSessionProvider`) we'll initialize an event listener on deep links to the application.

```js
React.useEffect(() => {
    Linking.addEventListener("url", async (event) => {
      ...
    });
  }, []);
```

Now that we have a listener on deep links, we want to initiate a silent login only when we got back from a redirect session with a logged in user and we are currently not logged in to the app.

```diff
React.useEffect(() => {
    Linking.addEventListener("url", async (event) => {
+     const url = new URL(event.url);
+     const wixMemberLoggedIn = url.searchParams.get("wixMemberLoggedIn");
+     const requiresSilentLogin =
+       wixMemberLoggedIn === "true" && session.refreshToken.role !== "member";
+     if (requiresSilentLogin) {
+       ...
+     }
    });
  }, []);
```

In our event listener, we parsed the url, and then checked if the `wixMemberLoggedIn` query parameters is set true, and that our current session isn't for a member (meaning we are logged out).

Now that we know that we need to perform a silent login we'll start the silent login by getting the authorization url for the OAuth process and save it in some state so we can open it in a `WebView`.

```diff

+ const [loginState, setLoginState] = React.useState(null);
+ const auth = useWixAuth();

+ const silentLoginMutation = useMutation(
+   async () => {
+     setSessionLoading(true);
+     const data = auth.generateOAuthData(
+       Linking.createURL("/oauth/wix/callback")
+     );
+     const { authUrl } = await auth.getAuthUrl(data, {
+       prompt: "none",
+     });
+     return { authUrl, data };
+   },
+   {
+     onSuccess: async ({ authUrl, data }) => {
+       setLoginState({
+         url: authUrl,
+         data,
+       });
+     },
+   }
+ );
```

Our mutation generates an authentication url with `prompt: "none"` so that we will get the access tokens for the member that is currently logged in the Wix domain.

Now we are ready to display our `WebView` to perform the OAuth process and finish by getting the member tokens. Add the following code to your render flow.

```diff
+if (!loginState) {
+    return null;
+  } else {
+    return (
+      <WebView
+        source={{ uri: loginState.url }}
+        originWhitelist={["exp://*"]}
+        containerStyle={{ display: "none" }}
+        onShouldStartLoadWithRequest={(request) => {
+          if (
+            request.url.startsWith(Linking.createURL("/oauth/wix/+callback"))
+          ) {
+            const { code, state } = auth.parseFromUrl(
+              request.url,
+              loginState.data
+            );
+            auth
+              .getMemberTokens(code, state, loginState.data)
+              .then((tokens) => {
+                setSession(tokens);
+                setLoginState(null);
+              });
+            return false;
+          }
+          return true;
+        }}
+      />
+    );
+  }
```

Here we rendered a non-visible `WebView` and listen on when it gets redirected back to the callback url. Once we have the callback `code` and `state` we can finish the process by calling `getMemberTokens` and storing the new tokens we got, and refresh the session state of the application.