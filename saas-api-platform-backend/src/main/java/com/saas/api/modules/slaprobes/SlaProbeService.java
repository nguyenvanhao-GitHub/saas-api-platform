package com.saas.api.modules.slaprobes;

import java.util.List;
import java.util.UUID;

public interface SlaProbeService {
    List<SlaProbe> getAllProbes();
    SlaProbe createProbe(CreateSlaProbeDto dto);
    SlaProbe pingProbe(UUID id);
    void deleteProbe(UUID id);
}