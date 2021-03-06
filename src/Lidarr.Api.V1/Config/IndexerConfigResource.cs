﻿using NzbDrone.Core.Configuration;
using Lidarr.Http.REST;

namespace Lidarr.Api.V1.Config
{
    public class IndexerConfigResource : RestResource
    {
        public int MinimumAge { get; set; }
        public int Retention { get; set; }
        public int RssSyncInterval { get; set; }
    }

    public static class IndexerConfigResourceMapper
    {
        public static IndexerConfigResource ToResource(IConfigService model)
        {
            return new IndexerConfigResource
            {
                MinimumAge = model.MinimumAge,
                Retention = model.Retention,
                RssSyncInterval = model.RssSyncInterval,
            };
        }
    }
}
