
<!---

This README is automatically generated from the comments in these files:
carbon-location.html  carbon-route-converter.html  carbon-route.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

The bot does some handling of markdown. Please file a bug if it does the wrong
thing! https://github.com/PolymerLabs/tedium/issues

-->

[![Build status](https://travis-ci.org/PolymerElements/carbon-route.svg?branch=master)](https://travis-ci.org/PolymerElements/carbon-route)

_[Demo and API docs](https://elements.polymer-project.org/elements/carbon-route)_


##&lt;carbon-route&gt;

`carbon-route` is an element that enables declarative, self-describing routing
for a web app.

> *n.b. carbon-route is still in beta. We expect it will need some changes. We're counting on your feedback!*

In its typical usage, a `carbon-route` element consumes an object that describes
some state about the current route, via the `route` property. It then parses
that state using the `pattern` property, and produces two artifacts: some `data`
related to the `route`, and a `tail` that contains the rest of the `route` that
did not match.

Here is a basic example, when used with `carbon-location`:

```html
<carbon-location route="{{route}}"></carbon-location>
<carbon-route
    route="{{route}}"
    pattern="/:page"
    data="{{data}}"
    tail="{{tail}}">
</carbon-route>
```

In the above example, the `carbon-location` produces a `route` value. Then, the
`route.path` property is matched by comparing it to the `pattern` property. If
the `pattern` property matches `route.path`, the `carbon-route` will set or update
its `data` property with an object whose properties correspond to the parameters
in `pattern`. So, in the above example, if `route.path` was `'/about'`, the value
of `data` would be `{"page": "about"}`.

The `tail` property represents the remaining part of the route state after the
`pattern` has been applied to a matching `route`.

Here is another example, where `tail` is used:

```html
<carbon-location route="{{route}}"></carbon-location>
<carbon-route
    route="{{route}}"
    pattern="/:page"
    data="{{routeData}}"
    tail="{{subroute}}">
</carbon-route>
<carbon-route
    route="{{subroute}}"
    pattern="/:id"
    data="{{subrouteData}}">
</carbon-route>
```

In the above example, there are two `carbon-route` elements. The first
`carbon-route` consumes a `route`. When the `route` is matched, the first
`carbon-route` also produces `routeData` from its `data`, and `subroute` from
its `tail`. The second `carbon-route` consumes the `subroute`, and when it
matches, it produces an object called `subrouteData` from its `tail`.

So, when `route.path` is `'/about'`, the `routeData` object will look like
this: `{ page: 'about' }`

And `subrouteData` will be null. However, if `route.path` changes to
`'/article/123'`, the `routeData` object will look like this:
`{ page: 'article' }`

And the `subrouteData` will look like this: `{ id: '123' }`

`carbon-route` is responsive to bi-directional changes to the `data` objects
they produce. So, if `routeData.page` changed from `'article'` to `'about'`,
the `carbon-route` will update `route.path`. This in-turn will update the
`carbon-location`, and cause the global location bar to change its value.



##&lt;carbon-location&gt;

`carbon-location` is an element that provides synchronization between the
browser location bar and the state of an app. When created, `carbon-location`
elements will automatically watch the global location for changes. As changes
occur, `carbon-location` produces and updates an object called `route`. This
`route` object is suitable for passing into a `carbon-route`, and other similar
elements.

An example of a route object that describes the URL
`https://elements.polymer-project.org/elements/carbon-route-converter?foo=bar&baz=qux`:

```css
{
  prefix: '',
  path: '/elements/carbon-route-converter'
}
```

Example Usage:

```html
<carbon-location route="{{route}}"></carbon-location>
<carbon-route route="{{route}}" pattern="/:page" data="{{data}}"></carbon-route>
```

As you can see above, the `carbon-location` element produces a `route` and that
property is then bound into the `carbon-route` element. The bindings are two-
directional, so when changes to the `route` object occur within `carbon-route`,
they automatically reflect back to the global location.

A `carbon-location` can be configured to use the hash part of a URL as the
canonical source for path information.

Example:

```html
<carbon-location route="{{route}}" use-hash-as-path></carbon-location>
```



##&lt;carbon-route-converter&gt;

`carbon-route-converter` provides a means to convert a path and query
parameters into a route object and vice versa. This produced route object
is to be fed into route-consuming elements such as `carbon-route`.

> n.b. This element is intended to be a primitive of the routing system and for
creating bespoke routing solutions from scratch. To simply include routing in
an app, please refer to [carbon-location](https://github.com/PolymerElements/carbon-route/blob/master/carbon-location.html)
and [carbon-route](https://github.com/PolymerElements/carbon-route/blob/master/carbon-route.html).

An example of a route element that describes
`https://elements.polymer-project.org/elements/carbon-route-converter?foo=bar&baz=qux`:

```css
{
  prefix: '',
  path: '/elements/carbon-route-converter',
  queryParams: {
    foo: 'bar',
    baz: 'qux'
  }
}
```

Example Usage:

```html
<iron-location path="{{path}}" query="{{query}}"></iron-location>
<iron-query-params
    params-string="{{query}}"
    params-object="{{queryParams}}">
</iron-query-params>
<carbon-route-converter
    path="{{path}}"
    query-params="{{queryParams}}"
    route="{{route}}">
</carbon-route-converter>
<carbon-route route='{{route}}' pattern='/:page' data='{{data}}'>
</carbon-route>
```

This is a simplified implementation of the `carbon-location` element. Here the
`iron-location` produces a path and a query, the `iron-query-params` consumes
the query and produces a queryParams object, and the `carbon-route-converter`
consumes the path and the query params and converts it into a route which is in
turn is consumed by the `carbon-route`.


