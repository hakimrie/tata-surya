import { SolarSystemScene } from '../scenes/SolarSystemScene';
import { formatSimulationDate } from '../utils/formatting';
import { t, getLanguage } from '../utils/i18n';

export class SnapshotStudio {
  public static captureSnapshot(scene: SolarSystemScene, simDate?: Date): void {
    const isEn = getLanguage() === 'en';

    try {
      // Force render to ensure buffer is fresh
      scene.renderer.render(scene.scene, scene.camera);

      // Create an off-screen canvas to composite aesthetic watermark badge
      const sourceCanvas = scene.renderer.domElement;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = sourceCanvas.width;
      offCanvas.height = sourceCanvas.height;
      const ctx = offCanvas.getContext('2d')!;

      // Draw 3D scene
      ctx.drawImage(sourceCanvas, 0, 0);

      // Composite aesthetic educational badge in bottom-left
      const pad = 24;
      const cardW = 320;
      const cardH = 75;
      const cardX = pad;
      const cardY = offCanvas.height - cardH - pad;

      ctx.save();
      // Glass card background
      ctx.fillStyle = 'rgba(3, 7, 18, 0.75)';
      ctx.roundRect ? ctx.roundRect(cardX, cardY, cardW, cardH, 12) : ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.fillText(isEn ? '3D SOLAR SYSTEM SIMULATION' : 'SIMULASI 3D TATA SURYA', cardX + 16, cardY + 28);

      // Date / Physics engine subtitle
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px system-ui, sans-serif';
      const dateStr = simDate ? formatSimulationDate(simDate) : new Date().toLocaleDateString();
      ctx.fillText(`📅 ${dateStr} • RK4 Orbital Physics`, cardX + 16, cardY + 48);

      // Portal credit
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText('experiment.bukuanak.id', cardX + 16, cardY + 64);

      ctx.restore();

      // Export to PNG data URL and trigger download
      const dataUrl = offCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      const filenameDate = simDate ? simDate.toISOString().split('T')[0] : 'celestial';
      a.download = `tata-surya-3d-${filenameDate}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Failed to capture snapshot:', e);
      alert(isEn ? 'Snapshot capture failed.' : 'Gagal mengambil gambar snapshot.');
    }
  }
}
