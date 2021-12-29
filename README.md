# dp-lister

List dependencies used in your projects (dotnetcore, dotnet, node (angular, react))

## Getting started
```
npm install dp-lister
```

## Get dotnet core application dependencies
```
import { getDotnetCoreDependencies, Application } from 'dp-lister';

const dotnetCoreDependencies: Array<Application> = getDotnetCoreDependencies(workingDirectory);
```

## Get dotnet application dependencies
```
import { getDotnetDependencies, Application } from 'dp-lister';

const dotnetDependencies: Array<Application> = getDotnetDependencies(workingDirectory);
```

## Get node application dependencies
```
import { getNpmDependencies, Application } from 'dp-lister';

const npmDependencies: Array<Application> = getNpmDependencies(workingDirectory);
```
