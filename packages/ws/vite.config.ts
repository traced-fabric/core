import defineBuildConfig from '../../vite.config';

export default defineBuildConfig({
  externals: ['@traced-fabric/core'],
});
