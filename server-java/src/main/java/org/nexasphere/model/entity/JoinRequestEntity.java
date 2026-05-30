package org.nexasphere.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "collab_join_requests")
public class JoinRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Team ID is required")
    @Column(name = "team_id")
    private Long teamId;

    @NotBlank(message = "Pitch is required")
    @Size(max = 2000, message = "Pitch must not exceed 2000 characters")
    @Column(length = 2000)
    private String pitch;

    @NotBlank(message = "Skills are required")
    @Size(max = 500, message = "Skills must not exceed 500 characters")
    private String skills;

    @Size(max = 255, message = "GitHub URL must not exceed 255 characters")
    @Pattern(
        regexp = "^(https?://github\\.com/.*)?$",
        message = "GitHub must be a valid GitHub URL"
    )
    private String github;

    // "PENDING", "ACCEPTED", "REJECTED"
    private String status = "PENDING";

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    public String getPitch() { return pitch; }
    public void setPitch(String pitch) { this.pitch = pitch; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
