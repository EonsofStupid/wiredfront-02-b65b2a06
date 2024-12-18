export interface TestingEnvironment {
  id: string;
  userId: string;
  environmentName: string;
  framework: string;
  dockerConfig: {
    typescript: boolean;
    vite: boolean;
    tailwind: boolean;
    shadcn: boolean;
    livePreview: boolean;
    port: number;
    nodeVersion: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EnvironmentFramework = 'react' | 'vue' | 'svelte' | 'angular';

export interface EnvironmentSetupConfig {
  framework: EnvironmentFramework;
  typescript: boolean;
  tailwind: boolean;
  port?: number;
  additionalPackages?: string[];
}