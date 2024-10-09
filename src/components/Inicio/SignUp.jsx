import React from 'react';
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';


function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    // setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      fsurname: "",
      msurname: "",
      birthday: "",
      // gender: "",
      nickname: "",
      email: "",
      password: "",
      confirmarPassword: ""
    },
  });

  const password = useRef(null);
  password.current = watch("password", "");

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    // reset({
    //   nombre: '',
    //   correo: '',
    //   fechaNacimiento: '',
    //   password: '',
    //   confirmarPassword: '',
    //   pais: 'ar',
    //   archivo: '',
    //   aceptaTerminos: false
    // })
    reset();
  });

  return (
    <div>
    <form onSubmit={onSubmit}>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          autoFocus
          {...register("name", {
            required: {
              value: true,
              message: "Nombre es requerido",
            },
            maxLength: 20,
            minLength: 2,
          })}
        />
        {errors.name?.type === "required" && <span>Nombre requerido</span>}
        {errors.name?.type === "maxLength" && (
          <span>Nombre no debe ser mayor a 20 caracteres</span>
        )}
        {errors.name?.type === "minLength" && (
          <span>Nombre debe ser mayor a 2 caracteres</span>
        )}
      </div>
      <div>
        <label>Apellido Paterno:</label>
        <input
          type="text"
          name="fsurname"
          {...register("fsurname", {
            required: {
              value: true,
              message: "Apellido es requerido",
            },
            maxLength: 20,
            minLength: 2,
          })}
        />
        {errors.fsurname?.type === "required" && <span>Apellido requerido</span>}
        {errors.fsurname?.type === "maxLength" && (
          <span>Nombre no debe ser mayor a 20 caracteres</span>
        )}
        {errors.fsurname?.type === "minLength" && (
          <span>Nombre debe ser mayor a 2 caracteres</span>
        )}
      </div>
      <div>
        <label>Apellido Materno:</label>
        <input
          type="text"
          name="msurname"
          {...register("msurname", {
            required: {
              value: true,
              message: "Apellido es requerido",
            },
            maxLength: 20,
            minLength: 2,
          })}
        />
        {errors.msurname?.type === "required" && <span>Apellido requerido</span>}
        {errors.msurname?.type === "maxLength" && (
          <span>Nombre no debe ser mayor a 20 caracteres</span>
        )}
        {errors.msurname?.type === "minLength" && (
          <span>Nombre debe ser mayor a 2 caracteres</span>
        )}
      </div>
      <div>
        <label>Fecha de Nacimiento:</label>
        <input
          type="date"
          name="birthday"
          {...register("birthday", {
            required: {
              value: true,
              message: "Fecha de nacimiento es requerida",
            },
            validate: (value) => {
              const birthday = new Date(value);
              const fechaActual = new Date();
              const edad =
                fechaActual.getFullYear() - birthday.getFullYear();
              return edad >= 18 || "Debes ser mayor de edad";
            },
          })}
        />
        {errors.birthday && (
          <span>{errors.birthday.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="gender">Género:</label>
        <label>
          <input type="radio" name="gender" id="gender" value="male" {...register("gender")}/>
          Hombre
        </label>
        <label>
          <input type="radio" name="gender" id="gender" value="female" {...register("gender")}/>
          Mujer
        </label>
        <label>
          <input type="radio" name="gender" id="gender" value="non-binary" {...register("gender")}/>
          Sin mencionar
        </label>
        {/* {...register("gender", {
            required: {
              value: true,
              message: "Selecciona algun genero",
            },
          })} */}
      </div>
      <div>
        <label>Apodo:</label>
        <input
          type="text"
          name="nickname"
          autoFocus
          {...register("nickname", {
            required: {
              value: true,
              message: "Apodo es requerido",
            },
            maxLength: 20,
            minLength: 2,
          })}
        />
        {errors.nickname?.type === "required" && <span>Nombre requerido</span>}
        {errors.nickname?.type === "maxLength" && (
          <span>Nombre no debe ser mayor a 20 caracteres</span>
        )}
        {errors.nickname?.type === "minLength" && (
          <span>Nombre debe ser mayor a 2 caracteres</span>
        )}
      </div>
      <div>
        <label>Correo Electrónico:</label>
        <input
          type="email"
          name="email"
          {...register("email", {
            required: {
              value: true,
              message: "Correo es requerido",
            },
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Correo no válido",
            },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          name="password"
          {...register("password", {
            required: {
              value: true,
              message: "Contraseña es requerida",
            },
            minLength: {
              value: 6,
              message: "Contraseña debe ser mayor a 6 caracteres",
            },
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <label>Confirma Contraseña:</label>
        <input
          type="password"
          name="confirmarPassword"
          {...register("confirmarPassword", {
            required: {
              value: true,
              message: "Confirmar contraseña es requerida",
            },
            minLength: {
              value: 6,
              message: "Confirmar contraseña debe ser mayor a 6 caracteres",
            },
            validate: (value) =>
              value === password.current || "Las contraseñas no coinciden",
          })}
        />
        {errors.confirmarPassword && (
          <span>{errors.confirmarPassword.message}</span>
        )}
      </div>

      {/* <div>
        <label htmlFor="archivo">subir nombre de archivo:</label>
        <input
          type="file"
          onChange={(e) => {
            setValue("archivo", e.target.files[0].name);
          }}
        />
        {errors.archivo && <span>{errors.archivo.message}</span>}
      </div>

      <div>
        <input
          type="checkbox"
          name="aceptaTerminos"
          {...register("aceptaTerminos", {
            required: {
              value: true,
              message: "Acepta los términos y condiciones",
            },
          })}
        />
        <label>Acepto los términos y condiciones</label>
        {errors.aceptaTerminos && <span>{errors.aceptaTerminos.message}</span>}
      </div> */}

      <button type="submit">Enviar</button>

      <pre style={{ width: "400px" }}>{JSON.stringify(watch(), null, 2)}</pre>
      <h3>Hello {watch("name")}</h3>
    </form>
    </div>
  );
}

export default SignUp;