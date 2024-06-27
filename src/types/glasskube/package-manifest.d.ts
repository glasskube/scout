/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type PackageScope = 'Cluster' | 'Namespaced';
export type ValueType = 'boolean' | 'text' | 'number' | 'options';
export type ValueDefinitionTarget = {
  resource?: TypedObjectReference;
  chartName?: string;
  patch: PartialJsonPatch;
  valueTemplate?: string;
} & ValueDefinitionTarget1;
export type ValueDefinitionTarget1 = WithResource | WithChartName;

export interface HttpsGlasskubeDevSchemasV1PackageManifestJson {
  scope?: PackageScope;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  references?: PackageReference[];
  iconUrl?: string;
  helm?: HelmManifest;
  kustomize?: KustomizeManifest;
  manifests?: PlainManifest[];
  valueDefinitions?: {
    [k: string]: ValueDefinition;
  };
  defaultNamespace: string;
  entrypoints?: PackageEntrypoint[];
  dependencies?: Dependency[];
}
export interface PackageReference {
  label: string;
  url: string;
}
export interface HelmManifest {
  repositoryUrl: string;
  chartName: string;
  chartVersion: string;
  values?: JSON;
}
export interface JSON {
  [k: string]: unknown;
}
export interface KustomizeManifest {}
export interface PlainManifest {
  url: string;
  defaultNamespace?: string;
}
export interface ValueDefinition {
  type: ValueType;
  metadata?: ValueDefinitionMetadata;
  defaultValue?: string;
  options?: string[];
  constraints?: ValueDefinitionConstraints;
  targets: ValueDefinitionTarget[];
}
export interface ValueDefinitionMetadata {
  label?: string;
  description?: string;
  hints?: string[];
}
export interface ValueDefinitionConstraints {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}
export interface TypedObjectReference {
  apiGroup: string;
  kind: string;
  name: string;
  namespace?: string;
}
export interface PartialJsonPatch {
  op: string;
  path: string;
}
export interface WithResource {
  [k: string]: unknown;
}
export interface WithChartName {
  [k: string]: unknown;
}
export interface PackageEntrypoint {
  name?: string;
  serviceName: string;
  port: number;
  localPort?: number;
  scheme?: string;
}
export interface Dependency {
  name: string;
  version?: string;
}
