using System.Linq;
using NzbDrone.Common.Disk;
using NzbDrone.Core.Music;
using NzbDrone.Core.Music.Events;

namespace NzbDrone.Core.HealthCheck.Checks
{
    [CheckOn(typeof(ArtistDeletedEvent))]
    [CheckOn(typeof(ArtistMovedEvent))]
    public class RootFolderCheck : HealthCheckBase
    {
        private readonly IArtistService _artistService;
        private readonly IDiskProvider _diskProvider;

        public RootFolderCheck(IArtistService artistService, IDiskProvider diskProvider)
        {
            _artistService = artistService;
            _diskProvider = diskProvider;
        }

        public override HealthCheck Check()
        {
            var missingRootFolders = _artistService.GetAllArtists()
                                                   .Select(s => _diskProvider.GetParentFolder(s.Path))
                                                   .Distinct()
                                                   .Where(s => !_diskProvider.FolderExists(s))
                                                   .ToList();

            if (missingRootFolders.Any())
            {
                if (missingRootFolders.Count == 1)
                {
                    return new HealthCheck(GetType(), HealthCheckResult.Error, "Missing root folder: " + missingRootFolders.First(), "#missing-root-folder");
                }

                var message = string.Format("Multiple root folders are missing: {0}", string.Join(" | ", missingRootFolders));
                return new HealthCheck(GetType(), HealthCheckResult.Error, message, "#missing-root-folder");
            }

            return new HealthCheck(GetType());
        }
    }
}
