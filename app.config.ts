import type { ConfigContext, ExpoConfig } from 'expo/config';

type IntentFilter = NonNullable<NonNullable<ExpoConfig['android']>['intentFilters']>[number];

const toArray = <T,>(value?: T | T[]): T[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

const createSchemeIntentFilter = (scheme: string): IntentFilter => ({
  action: 'VIEW',
  category: ['BROWSABLE', 'DEFAULT'],
  data: [{ scheme }],
});

const createHttpsIntentFilter = (host: string): IntentFilter => ({
  action: 'VIEW',
  category: ['BROWSABLE', 'DEFAULT'],
  data: [{ scheme: 'https', host, pathPrefix: '/' }],
});

const hasDataMatch = (filter: IntentFilter, matcher: (data: any) => boolean) =>
  toArray(filter.data).some((data) => data && matcher(data));

export default ({ config }: ConfigContext): ExpoConfig => {
  const schemes = toArray(config.scheme).filter(Boolean);
  const appDomain = process.env.EXPO_PUBLIC_APP_DOMAIN?.trim();

  const androidIntentFilters = [...(config.android?.intentFilters ?? [])];

  if (schemes.length > 0) {
    const primaryScheme = schemes[0];
    const hasSchemeFilter = androidIntentFilters.some((filter) =>
      hasDataMatch(filter, (data) => data.scheme === primaryScheme)
    );

    if (!hasSchemeFilter) {
      androidIntentFilters.unshift(createSchemeIntentFilter(primaryScheme));
    }
  }

  if (appDomain) {
    const hasAppLinkFilter = androidIntentFilters.some((filter) =>
      hasDataMatch(filter, (data) => data.scheme === 'https' && data.host === appDomain)
    );

    if (!hasAppLinkFilter) {
      androidIntentFilters.push(createHttpsIntentFilter(appDomain));
    }
  }

  const associatedDomains = appDomain
    ? Array.from(new Set([...(config.ios?.associatedDomains ?? []), `applinks:${appDomain}`]))
    : config.ios?.associatedDomains;

  return {
    ...config,
    slug: config.slug || 'app',
    name: config.name || 'app',
    scheme: schemes.length > 1 ? schemes : schemes[0] ?? config.scheme,
    ios: {
      ...config.ios,
      associatedDomains,
    },
    android: {
      ...config.android,
      intentFilters: androidIntentFilters.length > 0 ? androidIntentFilters : config.android?.intentFilters,
    },
  };
};
