import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../userContext";
import { useTranslation } from "react-i18next";
import "./styles.css";
import noPfp from "../../assets/nopic-23-136831-198x198.png";

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pfp: "",
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return navigate("/");

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
          setFormData({
            name: data.user.name,
            email: data.user.email,
            pfp: data.user.pfp || "",
          });
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate, setUser]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.pfp && formData.pfp !== user.pfp)
        updateData.pfp = formData.pfp;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsEditing(false);
      } else {
        alert(data.message || "Erro ao atualizar perfil");
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) return null;

  return (
    <>
      <div className="profile-background">
        <img
          src="https://www.apparelentrepreneurship.com/wp-content/uploads/2019/04/apparel_entrepreneurship_what_your_clothing_brand_needs_to_stay_relevant_2019.jpg"
          alt="Background Men"
          className="bg-img"
        />
        <img
          src="https://cdn.prod.website-files.com/61083e5f5398b157c850d20a/6808fd7f84e7f1bab2bba0e8_660c252e41e2cc4e1aee8a9b_Main%2520Blog%2520Image%2520(1080%2520x%25201080%2520px).png"
          alt="Background Women"
          className="bg-img"
        />
      </div>

      <div className="profile-wrapper">
        <h2 className="profile-title">{t("title.profile")}</h2>

        <div className="profile-left">
          <div className="profile-pfp">
            <img
              src={formData.pfp || user.pfp || noPfp}
              alt="Foto de perfil"
              className="pfp-img"
            />
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-group-column">
            <label>{t("fields.name")}:</label>
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            ) : (
              <span>{user.name}</span>
            )}
          </div>

          <div className="profile-group-column">
            <label>{t("fields.email")}:</label>
            {isEditing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            ) : (
              <span>{user.email}</span>
            )}
          </div>

          {isEditing && (
            <div className="profile-group-column">
              <label>{t("fields.pfp_link") || "Foto URL"}:</label>
              <input
                type="url"
                name="pfp"
                value={formData.pfp}
                onChange={handleChange}
                placeholder="https://..."
                autoComplete="off"
              />
            </div>
          )}

          <div className="profile-buttons">
            {isEditing ? (
              <button className="btn save" onClick={handleSave}>
                {t("buttons.save")}
              </button>
            ) : (
              <button className="btn edit" onClick={handleEdit}>
                {t("buttons.edit")}
              </button>
            )}
            <button className="btn logout" onClick={handleLogout}>
              {t("buttons.logout")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
