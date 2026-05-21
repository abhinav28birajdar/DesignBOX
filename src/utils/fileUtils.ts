import localforage from 'localforage';

export interface DesignBoxProject {
  app: string;
  version: string;
  name: string;
  created: string;
  modified: string;
  canvas: {
    width: number;
    height: number;
    background: string;
    dpi: number;
    units: 'px' | 'cm' | 'mm' | 'in';
  };
  fabricJSON: any;
}

// Save project to IndexedDB
export async function saveProject(
  projectName: string,
  fabricJSON: any,
  metadata: {
    width: number;
    height: number;
    background: string;
    dpi?: number;
    units?: string;
  }
): Promise<string> {
  const projectId = `project_${Date.now()}`;
  const project: DesignBoxProject = {
    app: 'DesignBox',
    version: '1.0.0',
    name: projectName,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    canvas: {
      width: metadata.width,
      height: metadata.height,
      background: metadata.background,
      dpi: metadata.dpi || 72,
      units: (metadata.units as any) || 'px',
    },
    fabricJSON,
  };

  await localforage.setItem(projectId, project);
  return projectId;
}

// Load project from IndexedDB
export async function loadProject(projectId: string): Promise<DesignBoxProject | null> {
  try {
    const project = await localforage.getItem<DesignBoxProject>(projectId);
    return project;
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
}

// List all projects
export async function listProjects(): Promise<Array<{ id: string; name: string; modified: string }>> {
  try {
    const projects: Array<{ id: string; name: string; modified: string }> = [];
    await localforage.iterate((value: DesignBoxProject, key: string | null) => {
      if (key?.startsWith('project_')) {
        projects.push({
          id: key,
          name: value.name,
          modified: value.modified,
        });
      }
    });
    return projects.sort((a, b) => 
      new Date(b.modified).getTime() - new Date(a.modified).getTime()
    );
  } catch (error) {
    console.error('Failed to list projects:', error);
    return [];
  }
}

// Download canvas as image
export async function downloadCanvasImage(
  canvas: any,
  filename: string,
  format: 'png' | 'jpg' | 'webp' = 'png',
  quality: number = 0.92,
  multiplier: number = 1
): Promise<void> {
  try {
    const dataURL = canvas.toDataURL({
      format: format === 'jpg' ? 'jpeg' : format,
      quality,
      multiplier,
      enableRetinaScaling: false,
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download canvas:', error);
    throw error;
  }
}
