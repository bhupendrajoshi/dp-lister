# dp-lister

List dependencies used in your projects (dotnetcore, dotnet, node (angular, react))

## Get dotnet core application dependencies
```
import { getDotnetCoreDependencies } from './src/dotnetCoreDependencyGetter';

const dotnetCoreDependencies: Array<Application> = getDotnetCoreDependencies(workingDirectory);
```

## Get dotnet application dependencies
```
import { getDotnetDependencies } from './src/dotnetDependencyGetter';

const dotnetDependencies: Array<Application> = getDotnetDependencies(workingDirectory);
```

## Get node application dependencies
```
import { getNpmDependencies } from './src/npmDependencyGetter';

const npmDependencies: Array<Application> = getNpmDependencies(workingDirectory);
```
