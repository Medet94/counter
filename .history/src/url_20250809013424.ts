export const baseURL = 'https://phoenix-dev.datamicron.com';
export const connection = '/api/data-loader-bff/api/v1/Connection';
export const connectionSearch = '/api/data-loader-bff/api/v1/Connection/search';
export const connectionById = '/api/data-loader-bff/v1/Connection';
export const connectionByProjectId =
  '/api/data-loader-bff/api/v1/Connection/project/{projectId}';
export const connectionTest = '/api/data-loader-bff/api/v1/Connection/test';
export const connectionTestById =
  '/api/data-loader-bff/api/v1/Connection/{id}/test';
export const connectorTypes =
  '/api/data-loader-bff/api/v1/Connection/connector-types';
export const connectorParametersByType =
  '/api/data-loader-bff/api/v1/Connection/connector-parameters/{connectorType}';
export const connectionColumnDataTypes =
  '/api/data-loader-bff/api/v1/Connection/column-categories/{category}/data-types';
export const discoverDatabases =
  '/api/data-loader-bff/api/v1/Connection/discover-databases';
export const exploreSourceById =
  '/api/data-loader-bff/api/v1/Connection/{id}/explore-source';
export const exploreSourceWithColumnsById =
  '/api/data-loader-bff/api/v1/Connection/{id}/explore-source-with-columns';
export const previewSource =
  '/api/data-loader-bff/api/v1/Connection/preview-source';

// Testing

//ControlsHost

controlRef.current.init({
  settings: control.settings,
  loading: pending,
  size: {
    width: containerRef.current.clientWidth,
    height: containerRef.current.clientHeight,
  },
});

useEffect(() => {
  if (!controlRef.current) return;

  controlRef.current.update({
    type: VisualUpdateType.Loading,
    loading: pending,
  });
}, [pending]);

// visual-options.ts



   

   



 Loading = 'Loading',

 // area-chart-control

 
  private loading: boolean;

    if (options.type === VisualUpdateType.Loading) {
      if (options.loading) {
        this.chart.showLoading('default', {
          text: '',
          color: '#1971c2',
          textColor: '#333',
          maskColor: 'rgba(255, 255, 255, 0.6)',
        });
      } else {
        this.chart.hideLoading();
      }
      return;
    }