import React, { useEffect, useState } from "react";
import "./Form.css"; // Import the CSS file

interface FormProps {
  onSubmit: (data: {
    companyInfo: string;
    productInfo: string;
    targetGroupProfile: string;
  }) => void;
  isLoading: boolean;
  error: string | null;
}

const Form: React.FC<FormProps> = ({ onSubmit, isLoading, error }) => {
  const [companyInfo, setCompanyInfo] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [targetGroupProfile, setTargetGroupProfile] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!companyInfo.trim()) {
      newErrors.companyInfo = "Company Info is required";
    }
    if (!productInfo.trim()) {
      newErrors.productInfo = "Product Info is required";
    }
    if (!targetGroupProfile.trim()) {
      newErrors.targetGroupProfile = "Target Group Profile is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onSubmit({ companyInfo, productInfo, targetGroupProfile });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setErrors({});
    }
    if (error) {
      setCompanyInfo("");
      setProductInfo("");
      setTargetGroupProfile("");
    }
  }, [isLoading, error]);

  return (
    <>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form-card">
        <div>
          <label>Company Info:</label>
          <textarea
            value={companyInfo}
            onChange={(e) => setCompanyInfo(e.target.value)}
            required
          />
          {errors.companyInfo && (
            <p style={{ color: "red" }}>{errors.companyInfo}</p>
          )}
        </div>
        <div>
          <label>Product Info:</label>
          <textarea
            value={productInfo}
            onChange={(e) => setProductInfo(e.target.value)}
            required
          />
          {errors.productInfo && (
            <p style={{ color: "red" }}>{errors.productInfo}</p>
          )}
        </div>
        <div>
          <label>Target Group Profile:</label>
          <textarea
            value={targetGroupProfile}
            onChange={(e) => setTargetGroupProfile(e.target.value)}
            required
          />
          {errors.targetGroupProfile && (
            <p style={{ color: "red" }}>{errors.targetGroupProfile}</p>
          )}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading
            ? "Please wait, Generating the video for you!"
            : "Generate Video"}
        </button>
      </form>
    </>
  );
};

export default Form;
