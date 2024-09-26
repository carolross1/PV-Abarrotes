import { Component, AfterViewInit, Input } from '@angular/core';
declare var H: any;

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})
export class MapComponent implements AfterViewInit {
  private platform: any;
  private map: any;
  private router: any;
  private ui: any;

  @Input() direccion: string = ''; // Propiedad para recibir la dirección

  constructor() {
    this.platform = new H.service.Platform({
      apikey: 'DGuUpQIlLi36A7dduCUH5t9gZq9jCLOGXRMuM-2NxCQ'
    });
    this.router = this.platform.getRoutingService();
  }

  ngAfterViewInit(): void {
    // Inicializar el mapa con capas por defecto
    const defaultLayers = this.platform.createDefaultLayers();
    const mapContainer = document.getElementById('map');
    this.map = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
      zoom: 14,
      center: { lat: 21.14778, lng: -100.93606 } // Centro inicial
    });

    // Permitir que el mapa sea interactivo
    const mapEvents = new H.mapevents.MapEvents(this.map);
    const behavior = new H.mapevents.Behavior(mapEvents);
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);

    // Centrar el mapa y agregar un marcador en un punto específico
    this.setMapCenter(21.14778, -100.93606); // Coordenadas del punto específico
  }

  // Método para centrar el mapa y agregar un marcador
  setMapCenter(lat: number, lng: number): void {
    const newCenter = { lat, lng };
    this.map.setCenter(newCenter);
    this.map.setZoom(14);

    // Agregar un marcador en la ubicación específica
    const marker = new H.map.Marker(newCenter);
    this.map.addObject(marker);
  }

  // Método para calcular la ruta a la dirección especificada
  calculateRouteToDireccion(): void {
    // Verifica que la dirección no esté vacía
    if (!this.direccion) {
      console.error('La dirección está vacía');
      return;
    }

    // Obtener la ubicación del usuario
    navigator.geolocation.getCurrentPosition(position => {
      const clientLat = position.coords.latitude;
      const clientLng = position.coords.longitude;

      const routingParameters = {
        'routingMode': 'fast',
        'transportMode': 'car',
        'origin': `${clientLat},${clientLng}`,
        'destination': this.direccion,
        'return': 'polyline'
      };

      // Solicitar la ruta
      this.router.calculateRoute(routingParameters, (result: any) => {
        if (result.routes.length) {
          const route = result.routes[0];
          const routeShape = route.sections[0].polyline;
          const linestring = H.geo.LineString.fromFlexiblePolyline(routeShape);
          const routeLine = new H.map.Polyline(linestring, {
            style: { strokeColor: 'blue', lineWidth: 5 }
          });

          // Agregar la línea al mapa
          this.map.addObject(routeLine);
          this.map.getViewModel().setLookAtData({
            bounds: routeLine.getBoundingBox()
          });
        }
      }, (error: any) => {
        console.error('Error al calcular la ruta', error);
      });
    });
  }
}
